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

class UtilisateurController extends AbstractController
{

    #[Route('/inscription', name: 'inscription', methods: ["GET", "POST"])]
    public function inscription(UtilisateurRepository $utilisateurRepository, Request $request, EntityManagerInterface $entityManager, FlashMessageHelperInterface $flashMessageHelperInterface, UtilisateurManagerInterface $utilisateurManager): Response {

        $utilisateur = new Utilisateur();
        $form = $this->createForm(UtilisateurType::class, $utilisateur, [
            'method' => 'POST',
            'action' => $this->generateUrl('inscription')
        ]);

        $form->handleRequest($request);
        if($form->isSubmitted() && $form->isValid()) {
            $this->addFlash('success', 'Inscription réussie');
            $password = $utilisateur->getPassword();
            $fichier_profil= $utilisateur->getNomPhotoProfil();
            $utilisateurManager->proccessNewUtilisateur($utilisateur,$password,$fichier_profil);
            $entityManager->persist($utilisateurManager);
            $entityManager->flush();
            return $this->redirectToRoute('inscription');
        }
        else{
            $flashMessageHelperInterface->addFormErrorsAsFlash($form);
        }

        return $this->render( '/utilisateur/inscription.html.twig', [
            'utilisateur' => $utilisateurRepository->findAll(),
            'form' => $form,
        ]);

    }
}
