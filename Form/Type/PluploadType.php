<?php

namespace Widop\PluploadBundle\Form\Type;

use Symfony\Component\Form\AbstractType,
    Symfony\Component\Form\FormBuilder,
    Symfony\Component\Form\FormInterface,
    Symfony\Component\Form\FormView;

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
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder
            ->setAttribute('upload_dir', $options['upload_dir'])
            ->setAttribute('picture', $options['picture'])
            ->setAttribute('picture_path', $options['picture_path']);
    }

    /**
     * {@inheritdoc}
     */
    public function buildView(FormView $view, FormInterface $form)
    {
        $view
            ->set('upload_dir', $form->getAttribute('upload_dir'))
            ->set('picture', $form->getAttribute('picture'))
            ->set('picture_path', $form->getAttribute('picture_path'));
    }

    /**
     * {@inheritdoc}
     */
    public function getDefaultOptions()
    {
        return array(
            'upload_dir'   => $this->uploadDir,
            'picture'      => false,
            'picture_path' => null,
        );
    }

    /**
     * {@inheritdoc}
     */
    public function getAllowedOptionValues()
    {
        return array(
            'picture' => array(true, false),
        );
    }

    /**
     * {@inheritdoc}
     */
    public function getParent(array $options)
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
