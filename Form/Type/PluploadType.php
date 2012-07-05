<?php

namespace Widop\PluploadBundle\Form\Type;

use Symfony\Component\Form\AbstractType,
    Symfony\Component\Form\FormBuilderInterface,
    Symfony\Component\Form\FormViewInterface,
    Symfony\Component\Form\FormInterface,
    Symfony\Component\OptionsResolver\OptionsResolverInterface;

/**
 * Plupload type.
 *
 * @author Timothée Martin <timothee@widop.com>
 * @author GeLo <geloen.eric@gmail.com>
 */
class PluploadType extends AbstractType
{
    /**
     * @var string The web directory containing uploaded files.
     */
    private $uploadDir;

    /**
     * Builds the form type.
     *
     * @param string $uploadDir   The web accessible directory containing uploaded files.
     */
    public function __construct($uploadDir)
    {
        $this->uploadDir = $uploadDir;
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->setAttribute('upload_dir', $options['upload_dir'])
            ->setAttribute('picture', $options['picture'])
            ->setAttribute('picture_path', $options['picture_path'])
            ->setAttribute('options', $options['options']);
    }

    /**
     * {@inheritdoc}
     */
    public function buildView(FormViewInterface $view, FormInterface $form, array $options)
    {
        $view
            ->setVar('upload_dir', $form->getAttribute('upload_dir'))
            ->setVar('picture', $form->getAttribute('picture'))
            ->setVar('picture_path', $form->getAttribute('picture_path'))
            ->setVar('options', $form->getAttribute('options'));
    }

    /**
     * {@inheritdoc}
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'upload_dir'   => $this->uploadDir,
            'picture'      => false,
            'picture_path' => null,
            'options'      => array(),
        ));

        $resolver->addAllowedValues(array(
            'picture' => array(true, false),
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getParent()
    {
        return 'text';
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'plupload';
    }
}
