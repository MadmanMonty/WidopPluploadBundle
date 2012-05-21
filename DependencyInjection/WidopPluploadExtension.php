<?php

namespace Widop\PluploadBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder,
    Symfony\Component\Config\FileLocator,
    Symfony\Component\HttpKernel\DependencyInjection\Extension,
    Symfony\Component\DependencyInjection\Loader;

/**
 * Widop Plupload extension.
 *
 * @author Timothée Martin <timothee@widop.com>
 */
class WidopPluploadExtension extends Extension
{
    /**
     * {@inheritDoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        $container->setParameter('twig.form.resources', array_merge(
            $container->getParameter('twig.form.resources'),
            array('WidopPluploadBundle:Form:plupload_widget.html.twig')
        ));

        $container->setParameter('widop_plupload.upload_dir', $config['upload_dir']);
        $container->setParameter('widop_plupload.web_dir', $config['web_dir']);

        $loader = new Loader\YamlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('services.yml');
    }
}
