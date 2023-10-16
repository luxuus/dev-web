<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use App\Form\PublicationType;
use App\Repository\PublicationRepository;
use App\Service\FlashMessageHelperInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Publication;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class PublicationController extends AbstractController
{

    //#[IsGranted('ROLE_TEST')]
    #[Route('/feed', name: 'feed', methods: ["GET", "POST"])]
    public function feed(PublicationRepository $publicationRepository, Request $request, EntityManagerInterface $entityManager, FlashMessageHelperInterface $flashMessageHelperInterface): Response
    {
        if($request->isMethod('POST')) {
            $this->denyAccessUnlessGranted('ROLE_USER');
        }
        $utilisateur = $this->getUser();
        $publication = new Publication();

        $publication->setAuteur($utilisateur);
        $publication->preFirstDatePublication();

        $form = $this->createForm(PublicationType::class, $publication, [
            'method' => 'POST',
            'action' => $this->generateURL('feed'),
        ]);
        $form->handleRequest($request);
        if($form->isSubmitted() && $form->isValid()) {
            $this->addFlash('success', 'Feed envoyé!');
            $entityManager->persist($publication);
            $entityManager->flush();

            return $this->redirectToRoute('feed');
        }
        else{
            $flashMessageHelperInterface->addFormErrorsAsFlash($form);

        }
        //On passe le formulaire comme paramètre du template.
        return $this->render( '/publication/feed.html.twig', [
            'publications' => $publicationRepository->findAllOrderedByDate(),
            'monFormulaire' => $form,
            'utilisateur' => $utilisateur,
        ]);
    }
    #[IsGranted('ROLE_USER')]
    #[Route('/feedy/{id}', name: 'deletePublication', options: ["expose" => true], methods: ['DELETE'])]
    public function deletePublication(#[MapEntity] ?Publication $publication, EntityManagerInterface $entityManager, FlashMessageHelperInterface $flashHelper, RequestStack $requestStack)
    {
        if($publication == null) {
            return new JsonResponse(null,404);
        }

        if($this->getUser() === $publication->getAuteur()){
            $entityManager->remove($publication);
            $entityManager->flush();
            $flashBag = $requestStack->getSession()->getFlashBag();
            $flashBag->add("success", "La publication a bien été supprimée !");
        }

        return new JsonResponse(null);
    }

}
