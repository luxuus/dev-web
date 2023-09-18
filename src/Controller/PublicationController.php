<?php

namespace App\Controller;

use App\Form\PublicationType;
use App\Repository\PublicationRepository;
use App\Service\FlashMessageHelperInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Publication;

class PublicationController extends AbstractController
{
    #[Route('/publication', name: 'app_publication')]
    public function index(): Response
    {
        return $this->render('publication/index.html.twig', [
            'controller_name' => 'PublicationController',
        ]);
    }

    #[Route('/feed', name: 'feed', methods: ["GET", "POST"])]
    public function feed(PublicationRepository $publicationRepository, Request $request, EntityManagerInterface $entityManager, FlashMessageHelperInterface $flashMessageHelperInterface): Response
    {

        $publication = new Publication();
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
        ]);
    }

}
