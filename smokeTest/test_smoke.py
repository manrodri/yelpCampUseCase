import unittest
import requests # request must be imported 
import os

class TestEndPointAreUp(unittest.TestCase):

    def setUp(self):
        with open('/tmp/public_ip.txt', 'r') as f:
            host = f.read().strip()

        self.HOST = host or 'localhost'
        self.PORT = os.environ.get('YELPCAMP_PORT') or 3000
        self.url = 'http://{host}:{port}'.format(host=self.HOST, port=self.PORT)
        print(self.url)


    def test_home_route(self):
        home_url = self.url + '/'
        response = requests.get(home_url)
        self.assertEqual(200, response.status_code)

    def test_campgrounds_route(self):
        campgrounds_url = self.url + '/campgrounds'
        response = requests.get(campgrounds_url)
        self.assertEqual(200, response.status_code)

    def test_non_existing_route(self):
        campgrounds_url = self.url + '/foo'
        response = requests.get(campgrounds_url)
        self.assertEqual(404, response.status_code)