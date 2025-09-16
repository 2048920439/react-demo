import { HttpService } from './HttpService'
import type { IHttpService } from '@/di/types'
import { BehaviorSubject, Subject } from 'rxjs'
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


  private _FormDataSubject = new BehaviorSubject(defaultApplicationFormData())
  FormDataChangeEvent = this._FormDataSubject.asObservable()
  get formData() {
    return this._FormDataSubject.getValue()
  }

  private _SubmitSubject = new Subject<ApplicationFormData>()
  SubmitEvent = this._SubmitSubject.asObservable()

  private _SubmitResultSubject = new Subject<{ result: any, isSuccess: boolean }>()
  SubmitResultEvent = this._SubmitResultSubject.asObservable()

  updateFromDate(data: ApplicationFormData) {
    this._FormDataSubject.next(data)
  }

  async submit() {
    this._SubmitSubject.next(this.formData)
    try {
      const result = await this.http.post('/api/application-form', this._FormDataSubject.getValue())
      this._SubmitResultSubject.next({ result, isSuccess: true })
      return result
    } catch (e) {
      this._SubmitResultSubject.next({ result: e, isSuccess: false })
      throw e
    }
  }

}