import {ReportVO} from "../apis/ReportApi";
import * as Taro from "@tarojs/taro";

interface IReportHelper {
  saveMeetTime(): void;
  getEmptyReport(): ReportVO;
}

class ReportHelper implements IReportHelper {

  private static readonly MEET_TIME_KEY = "mr.listen.report.meet_time";

  getEmptyReport(): ReportVO {
    let meetTime = Taro.getStorageSync(ReportHelper.MEET_TIME_KEY);
    meetTime = meetTime? meetTime: Date.now();
    return {
      _id: 'emptyReport_id',
      userId: 'emptyReportUserId',
      meetTime,
      holeCount: 0,
      longestDuration: 0,
      mostUsedWords: [],
      latestTime: 0,
      plusOneCount: 0,
      shareHoleCount: 0
    }
  }

  saveMeetTime(): void {
    if (!Taro.getStorageSync(ReportHelper.MEET_TIME_KEY)) {
      let meetTime = Date.now();
      let meetTimeDate = new Date(meetTime);
      Taro.setStorage({
        key: ReportHelper.MEET_TIME_KEY,
        data: meetTime
      })
        .then(() => {
          console.log('meet time save', meetTime, meetTimeDate);
        })
        .catch((e) => {
          console.error(e, 'meet time save error', meetTime, meetTimeDate);
        });
    }
  }

}

const reportHelper = new ReportHelper();

export default reportHelper;
