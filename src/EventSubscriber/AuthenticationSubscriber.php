<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Http\Event\LoginFailureEvent;
use Symfony\Component\Security\Http\Event\LoginSuccessEvent;
use Symfony\Component\Security\Http\Event\LogoutEvent;
class AuthenticationSubscriber {

    public function __construct(
        /* Injection de dépendance possible ici*/
        private RequestStack $requestStack
    ){}

    #[AsEventListener]
    public function loginSuccesEvent(LoginSuccessEvent $event)
    {
        $flashBag = $this->requestStack->getSession()->getFlashBag();
        $flashBag->add('success', 'Connexion réussie !');
    }

    #[AsEventListener]
    public function loginFailEvent(LoginFailureEvent $event)
    {
        $flashBag = $this->requestStack->getSession()->getFlashBag();
        $flashBag->add('error', 'Login et/ou mot de passe incorrect !');
    }

    #[AsEventListener]
    public function logoutEvent(LogoutEvent $event)
    {
        $flashBag = $this->requestStack->getSession()->getFlashBag();
        $flashBag->add('success', 'Déconnexion réussie !');
    }

}