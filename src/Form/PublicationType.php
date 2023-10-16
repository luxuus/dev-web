<?php

namespace App\Form;

use App\Entity\Publication;
use App\Entity\Utilisateur;
use App\Repository\UtilisateurRepository;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Validator\Constraints\Length;

class PublicationType extends AbstractType
{

    public function __construct(
        private Security $security)
    {

    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {

        $builder
            ->add('message',TextareaType::class, [
                'constraints' =>[
                    new Length(min: 4, max:200, minMessage: 'Trop court mec !', maxMessage: 'Trop long mec !', groups: ["publication:write:premium"] ),
                    new Length(min: 4, max:50, minMessage: 'Trop court mec !', maxMessage: 'Trop long mec !', groups: ["publication:write:normal"] )]
            ])
            ->add('publier',SubmitType::class)
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $group = $this->security->getUser()->isPremium() ? 'publication:write:premium' : 'publication:write:normal';
        $resolver->setDefaults([
            'data_class' => Publication::class,
            'validation_groups' => ['Default', $group]
        ]);
    }
}
