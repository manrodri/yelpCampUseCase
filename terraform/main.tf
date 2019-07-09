provider "aws" {
  profile    = "default"
  region = "eu-west-1"
 
}
resource "aws_instance" "staging_server" {

  ami = "ami-0d9f7dccc5299f2af"
  instance_type = "t2.micro"
  key_name      = "manuel_tech_case"
  private_ip = "192.168.1.241"
  vpc_security_group_ids = ["sg-0b0afa51d47dcad45"]
  subnet_id = "subnet-0f97221768fbbfa7c"

  connection {
    type     = "ssh"
    user     = "jenkins"
    private_key = "${file("${var.PATH_TO_PRIVATE_KEY}")}"
  }

  provisioner "local-exec"{
    command = "echo ${aws_instance.staging_server.public_ip} > /tmp/public_ip.txt"
  }

  provisioner "file" {
    source      = "../run.py"
    destination = "/tmp/run.py"
  }

  provisioner "remote-exec" {
    inline = [
      "python2 /tmp/run.py 3000",
      
    ]
  }
  tags = {
    Name = "server deployed by Terraform"
    owner= "manuel"
    provisioned="terraform"
  }
}


