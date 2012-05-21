<?php

namespace Widop\PluploadBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder,
    Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * Widop Plupload configuration.
 *
 * @author Timothée Martin <timothee@widop.com>
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritDoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('widop_plupload');

        $rootNode
            ->children()
                ->scalarNode('upload_dir')->defaultValue('%kernel.root_dir%/../web/uploads')->end()
                ->scalarNode('web_dir')->defaultValue('/uploads')->end()
            ->end();

        return $treeBuilder;
    }
}
