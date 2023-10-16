<?php

namespace App\Service;

use App\Entity\Utilisateur;
use App\Repository\UtilisateurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use Stripe\StripeClient;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class PaymentHandler implements PaymentHandlerInterface
{

    //Génère et renvoie un lien vers Stripe afin de finaliser l'achat du statut Premium pour l'utilisateur passé en paramètre.

    public function __construct(
        #[Autowire('%secret_key%')] private string $secretKey,
        #[Autowire('%premium_price%')] private int $premiumPrice,
        private RouterInterface $router,
        private UtilisateurRepository $utilisateurRepository,
        private EntityManagerInterface $entityManager,

    )
    {

    }

    public function handlePaymentPremium(Session $session) : void {
        $metadata = $session["metadata"];
        $login = $metadata["data"];
        $utilisateur = $this->utilisateurRepository->findOneByLogin($login);

        $paymentIntent = $session["payment_intent"];
        $stripe = new StripeClient($this->secretKey);

        $stripe->paymentIntents->cancel($paymentIntent);

        $paymentCapture = $stripe->paymentIntents->capture($paymentIntent, []);
        if($paymentCapture == null || $paymentCapture["status"] != "succeeded") {
            throw new \Exception("Le paiement n'a pas pu être complété...");
        }
        $utilisateur->setPremium(true);
        $this->entityManager->persist($utilisateur);
        $this->entityManager->flush();
    }

    public function getPremiumCheckoutUrlFor(Utilisateur $utilisateur)  : string {
        $paymentData = [
            'mode' => 'payment',
            'payment_intent_data' => ['capture_method' => 'manual', 'receipt_email' => $utilisateur->getAdresseEmail()],
            'customer_email' => $utilisateur->getAdresseEmail(),
            'success_url' => $this->router->generate('feed', [], UrlGeneratorInterface::ABSOLUTE_URL),
            'cancel_url' => $this->router->generate('premiumInfos', [], UrlGeneratorInterface::ABSOLUTE_URL),
            "metadata" => ["data" => $utilisateur->getLogin()],
            "line_items" => [
                [
                    "price_data" => [
                        "currency" => "eur",
                        "product_data" => ["name" => 'The Feed Premium'],
                        "unit_amount" => $this->premiumPrice*100
                    ],
                    "quantity" => 1
                ],
            ]
        ];
        Stripe::setApiKey($this->secretKey);
        $stripeSession = Session::create($paymentData);
        return $stripeSession->url;
    }


}