import os
import sys
import subprocess
from subprocess import Popen, PIPE
from zipfile import ZipFile
import logging
import argparse

# build parser and parse arguments
parser = argparse.ArgumentParser(description='command line tool to kill a previuous version and deploy new release candidate')

parser.add_argument('port', help='port node application is running')
parser.add_argument('--version', '-v', action='version', version='%(prog)s 1.0')
parser.add_argument('--debug', action='store_true')

args = parser.parse_args()


def set_up_logger():
    # set logger
    FORMAT = '[%(levelname)-2s] %(message)s'
    logging.basicConfig(format=FORMAT, level=10)
    logger = logging.getLogger()
    return logger


def execute_command_with_output(command, log, message=None, show_output=True):
    '''this function executes an unix command with output'''
    if isinstance(command, list):
        command = " ".join(command)
    log.info('executing command: %s ' % command)
    if message:
        log.info(message)
    proc = Popen(command, shell=True, stdout=PIPE)
    exec_output, exec_err = proc.communicate()
    if show_output:
        log.info("%s\n%s" % (exec_output, exec_err))
        print ("%s" % exec_output)
    if proc.returncode == 0:
        return True, exec_output, proc.returncode
    else:
        log.info('Error in execution of command: %s ', command)
        return False, exec_err, proc.returncode

logger = set_up_logger()

logger.info('Running from: {}'.format(os.getcwd()))

# I need to check if yelpCamp app is running
cmd = "netstat -ltnp | grep -w ':{}'".format(int(args.port))
rc = execute_command_with_output(cmd, logger, message="Running: {}".format(cmd), show_output=True)
if rc[1]:
  lines = rc[1].split(os.linesep)
  if rc[0]:
    for line in lines:
      words = line.split()
      pid = words[-1].split('/')[0]
      cmd = 'kill {}'.format(pid)
      success, output, exit_code = execute_command_with_output(cmd , logger, message='Running: {}'.format(cmd))
      if success:
        logger.info('Pid {} killed'.format(pid))
        break

else:
  logger.error('No service running on port: {}'.format(args.port))


# retrieve artifact from artifactory
os.chdir('/tmp')
cmd = 'curl -uadmin:AP4yc6KiPJbd7q36GqhzhxVHzFB -O http://http://34.245.22.117:8081/artifactory/generic-local/yelpCamp.zip'
rc = execute_command_with_output(cmd, logger, message='Retrieving artifact')
if not rc[0]:
  logger.error(rc[1])
  sys.exit(4)
else:
  logger.info('Artifact retrieved')



# extract artifact
path_to_zip_file = '/tmp/yelpCamp.zip'
directory_to_extract_to = '/tmp/yelpCampApp/'

with ZipFile(path_to_zip_file,"r") as zip_ref:
    zip_ref.extractall(directory_to_extract_to)


