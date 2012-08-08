<?php

namespace Widop\PluploadBundle\Form\Type;

use Symfony\Component\Form\AbstractType,
    Symfony\Component\Form\FormBuilderInterface,
    Symfony\Component\Form\FormView,
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
            ->setAttribute('picture_options', $options['picture_options'])
            ->setAttribute('in_collection', $options['in_collection'])
            ->setAttribute('options', $options['options']);
    }

    /**
     * {@inheritdoc}
     */
    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        $view->vars = array_replace($view->vars, array(
            'upload_dir'      => $form->getAttribute('upload_dir'),
            'picture_options' => $form->getAttribute('picture_options'),
            'in_collection'   => $form->getAttribute('in_collection'),
            'options'         => $form->getAttribute('options'),
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'upload_dir'      => $this->uploadDir,
            'picture_options' => array(
                'is_displayed' => false,
                'web_path'     => null,
                'max_width'    => null,
                'max_height'   => null,
                'class'        => null
            ),
            'in_collection'   => false,
            'options'         => array(),
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
