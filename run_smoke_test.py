import os
import sys
import unittest
import logging

scriptdir = os.getcwd()
smokeTest = os.path.join(scriptdir, 'smokeTest')
sys.path.insert(0, smokeTest)

logger = logging.getLogger()
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('[%(levelname)-2s] %(message)s')
handler.setFormatter(formatter)


if __name__ == '__main__':

    pattern =  "test*.py"
    test_dir = "smokeTest"

    sys.path.insert(0, test_dir)
    print("Running {} within {}".format(pattern, test_dir))

    test_loader = unittest.defaultTestLoader.discover(test_dir, pattern)
    test_runner = unittest.TextTestRunner()
    result = test_runner.run(test_loader)

    sys.exit(not result.wasSuccessful())