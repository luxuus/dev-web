<?php

namespace App\Form;

use App\Entity\Utilisateur;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Validator\Constraints\Blank;
use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Regex;
class UtilisateurType extends AbstractType
{


    public function buildForm(FormBuilderInterface $builder, array $options): void
    {

        $builder
            ->add('login', TextType::class, [
                'constraints' =>[
                    new Length(min: 4, max:20, minMessage: 'Trop court mec !', maxMessage: 'Trop long mec !' )]
                ])
            ->add('adresseEmail', EmailType::class)
            ->add('plainPassword', PasswordType::class, [
                'mapped' => false,
                'constraints' => [
                    new NotBlank(),
                    new NotNull(),
                    new Regex('#^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,30}$#', message: 'Le mot de passe n\'est pas valide'),
                    new Length(min: 8, max: 30, minMessage: 'Le mot de passe doit être d\'au moins 8 caractères', maxMessage: 'Le mot de passe doit être d\'au plus 30 caractères')
                ]
            ])
            ->add('fichierPhotoProfil', FileType::class, [
                'mapped' => false,
                'constraints' => [
                    new File(maxSize : '10M', maxSizeMessage: 'La taille de l\'image n\'est pas valide', extensions : ['jpg', 'png'])
                ]
            ])
            ->add('inscription', SubmitType::class)

        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $group = $
        $resolver->setDefaults([
            'data_class' => Utilisateur::class,
        ]);
    }
}
