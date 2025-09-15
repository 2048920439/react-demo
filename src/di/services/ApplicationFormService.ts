import { HttpService } from './HttpService'
import type { IHttpService } from '@/di/types'
import { BehaviorSubject } from 'rxjs'
import { inject, injectable } from 'tsyringe'


export interface ApplicationFormData {
  username: string
  sex: 0 | 1 | 2
  age: number
}

const defaultApplicationFormData = (): ApplicationFormData => {
  return {
    username: '',
    sex: 0,
    age: 0
  }
}

@injectable()
export class ApplicationFormService {
  constructor(
    @inject(HttpService) private http: IHttpService
  ) {}

  private _applicationFormData = new BehaviorSubject<ApplicationFormData>(defaultApplicationFormData())
  FormDataChangeEvent = this._applicationFormData.asObservable()

  updateFromDate(data: ApplicationFormData) {
    this._applicationFormData.next(data)
  }

  submit() {
    return this.http.post('/api/application-form', this._applicationFormData.getValue())
  }

}