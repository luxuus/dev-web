<?php

namespace App\Service;

use App\Entity\Utilisateur;
use Symfony\Component\Routing\RouterInterface;

interface PaymentHandlerInterface
{

        public function getPremiumCheckoutUrlFor(Utilisateur $utilisateur)  : string;
}