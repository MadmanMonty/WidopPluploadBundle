<?php

namespace Widop\PluploadBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Symfony\Component\HttpFoundation\File\File,
    Symfony\Component\HttpFoundation\Response;

/**
 * Plupload upload controller.
 *
 * @author Timothée Martin <timothee@widop.com>
 * @author GeLo <geloen.eric@gmail.com>
 */
class UploadController extends Controller
{
    /**
     * Asynchronous file upload.
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function uploadAction()
    {
        $file = new File($_FILES['file']['tmp_name']);
        $file = $file->move(
            $this->container->getParameter('widop_plupload.upload_dir'),
            $file->getFilename() . '.' . $file->guessExtension()
        );

        $response = new Response();
        $response->headers->set('Content-type', 'application/json');
        $response->setContent(json_encode(array('jsonrpc' => '2.0', 'id' => 'id', 'result' => $file->getFilename())));

        return $response;
    }
}
