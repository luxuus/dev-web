<?php

namespace App\Service;

use App\Repository\PublicationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class FlashMessageHelper implements FlashMessageHelperInterface
{

    public function __construct(
        private RequestStack $requestStack,
    )
    {}


    public function addFormErrorsAsFlash(FormInterface $form) : void
    {
        $errors = $form->getErrors(true);
        //Ajouts des erreurs du formulaire comme messages flash de la catégorie "error".
        foreach ($errors as $error) {
            $errorMsg = $error->getMessage();
            $flashBag = $this->requestStack->getSession()->getFlashBag();
            $flashBag->add('error', $errorMsg);
        }


    }
}