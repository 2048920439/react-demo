import { HttpToken } from '@/di/token'
import type { IApplicationFormService, IHttpService } from '@/di/types'
import { inject, injectable } from 'tsyringe'

@injectable()
export class ApplicationFormService implements IApplicationFormService {
  constructor(
    @inject(HttpToken) private http: IHttpService
  ) {}

  loadApplicationForm() {
    return this.http.get(`/api/application-form`)
  }

  saveApplicationForm(data: any) {
    return this.http.put(`/api/application-form`, data)
  }

  deleteApplicationForm() {
    return this.http.delete(`/api/application-form`)
  }
}