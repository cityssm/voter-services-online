import type { Request, Response } from 'express'

import { voterViewApi } from '../../helpers/api.helpers.js'

export default function handler(_request: Request, response: Response): void {
  response.render('votersListCheck', {})

  response.on('finish', () => {
    void voterViewApi.getGenders()
    void voterViewApi.getSchoolSupportCodes()
    void voterViewApi.getOccupancyStatuses()
    void voterViewApi.getRomanCatholicReligionCodes()
    void voterViewApi.getResidencyStatuses()
    void voterViewApi.getFrenchLanguageRightsCodes()
  })
}
