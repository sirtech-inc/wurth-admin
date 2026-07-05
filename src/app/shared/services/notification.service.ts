import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Params } from '../interface/core.interface';
import { NotificationModel } from '../interface/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public alertSubject = new Subject();

  public notification: boolean = true;

  constructor(private zone: NgZone,
    private http: HttpClient,
    private modalService: NgbModal,
    private toastr: ToastrService) { }

  showSuccess(message: string): void {
    this.alertSubject.next({ type: 'success', message: message });
    this.zone.run(() => {
      this.modalService.dismissAll();
      if (this.notification) {
        this.toastr.success(message);
      }
    });
  }

  showError(message: string, title: string = 'Aviso'): void {
    this.alertSubject.next({ type: 'error', message: message });
    this.zone.run(() => {
      if (this.notification) {
        this.toastr.error(message, title || 'Aviso');
      }
    });
  }

  showWarn(message: string, title: string = 'Aviso'): void {
    this.alertSubject.next({ type: 'warn', message: message });
    this.zone.run(() => {
      if (this.notification) {
        this.toastr.warning(message, title || 'Aviso');
      }
    });
  }

  getNotifications(payload?: Params): Observable<NotificationModel> {
    return of()
    //return this.http.get<NotificationModel>(`${environment.API_URL}/notification.json`, { params: payload });
  }

}
