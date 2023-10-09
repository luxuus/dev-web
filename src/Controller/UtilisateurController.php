<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use App\Form\UtilisateurType;
use App\Repository\UtilisateurRepository;
use App\Service\FlashMessageHelperInterface;
use App\Service\UtilisateurManager;
use App\Service\UtilisateurManagerInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class UtilisateurController extends AbstractController
{

    #[Route('/inscription', name: 'inscription', methods: ["GET", "POST"])]
    public function inscription(
        UtilisateurRepository $utilisateurRepository,
        Request $request, EntityManagerInterface $entityManager,
        FlashMessageHelperInterface $flashMessageHelperInterface,
        UtilisateurManagerInterface $utilisateurManager): Response
    {


        if($this->isGranted('ROLE_USER')) {
            return $this->redirectToRoute('feed');
        }

        $utilisateur = new Utilisateur();
        $form = $this->createForm(UtilisateurType::class, $utilisateur, [
            'method' => 'POST',
            'action' => $this->generateUrl('inscription')
        ]);
        $form->handleRequest($request);
        if($form->isSubmitted() && $form->isValid()) {
            $this->addFlash('success', 'Inscription réussie');
            $utilisateurManager->proccessNewUtilisateur($utilisateur,$form["plainPassword"]->getData(),$form["fichierPhotoProfil"]->getData());
            $entityManager->persist($utilisateur);
            $entityManager->flush();
            return $this->redirectToRoute('feed');
        }
        else{
            $flashMessageHelperInterface->addFormErrorsAsFlash($form);
        }

        return $this->render( '/utilisateur/inscription.html.twig', [
            'utilisateur' => $utilisateurRepository->findAll(),
            'form' => $form,
        ]);

    }

    #[Route('/login',name: 'login', methods: ["GET", "POST"])]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        if($this->isGranted('ROLE_USER')) {
            return $this->redirectToRoute('feed');
        }

        $lastUsername = $authenticationUtils->getLastUsername();
        return $this->render('/utilisateur/login.html.twig', [
            'last_username'=> $lastUsername,
        ]);
    }

    #[Route('/logout', name: 'logout', methods: ['POST'])]
    public function logout(): never
    {
        //Ne sera jamais appelée
        throw new \Exception("Cette route n'est pas censée être appelée. Vérifiez security.yaml");
    }
}
