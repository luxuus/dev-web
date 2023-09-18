<?php

namespace App\Service;

use App\Entity\Utilisateur;
use Symfony\Component\HttpFoundation\File\UploadedFile;

interface UtilisateurManagerInterface
{

    public function proccessNewUtilisateur(Utilisateur $utilisateur, ?string $plainPassword, ?UploadedFile $fichierPhotoProfil) : void;
}