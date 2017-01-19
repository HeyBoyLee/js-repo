#!/usr/bin/env python
# -*- coding: utf-8 -*-

import glob
import sys
sys.path.append('gen-py')
# sys.path.insert(0, glob.glob('../../lib/py/build/lib*')[0])

from helloworld import HelloWorld
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer


class HelloWorldHandler:
    def __init__(self):
        self.log = {}

    def printHelloWorld(self, name):
        print 'python - name:%s' % name


if __name__ == '__main__':
    handler = HelloWorldHandler()
    processor = HelloWorld.Processor(handler)
    transport = TSocket.TServerSocket(port=9090)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

    server = TServer.TSimpleServer(processor, transport, tfactory, pfactory)
    print('Starting the server...')
    server.serve()
    print('done.')


