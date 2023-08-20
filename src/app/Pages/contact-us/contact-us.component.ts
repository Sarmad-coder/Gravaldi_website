import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  formObj = {
    name: '',
    email: '',
    message: ''
  }
  constructor(
    private toast: ToastrService,
    private userSrv: UserService
  ) { }

  ngOnInit() {
  }

  submit() {
    if (
      this.formObj.email == '' ||
      this.formObj.message == '' ||
      this.formObj.name == ''
    ) {
      this.toast.error('Please fills all fields', '', {
        timeOut: 2000,
        positionClass: 'toast-bottom-right',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else {
      var check = this.validateEmail(this.formObj.email);
      if (check) {
        this.userSrv.contactUs(this.formObj).subscribe((resp: any) => {
          if (resp.message == 'success') {
            this.toast.success('Successfully Registerd', '', {
              timeOut: 2000,
              positionClass: 'toast-bottom-right',
              progressBar: true,
              progressAnimation: 'increasing'
            });
            this.formObj.email = '';
            this.formObj.message = '';
            this.formObj.name = '';
          } else {
            console.log('something went wrong');
          }
        })
      } else {
        this.toast.error('Email is not Correct', '', {
          timeOut: 2000,
          positionClass: 'toast-bottom-right',
          progressBar: true,
          progressAnimation: 'increasing'
        });
      }
    }
  }

  validateEmail(emailAdress) {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailAdress.match(regexEmail)) {
      return true;
    } else {
      return false;
    }
  }

}
