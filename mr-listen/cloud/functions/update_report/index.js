// 云函数入口文件
const cloud = require('wx-server-sdk');
const Segment = require('novel-segment');

cloud.init();
const db = cloud.database();

const HttpCode = {
    SUCCESS: 0,
    AUTHENTICATION_ERROR: 1,
    NOT_FOUND: 2,
    ERROR: 3
};

const BubbleType = {
    TEXT: 0,
    PICTURE: 1,
    VOICE: 2
};
// 云函数入口函数
exports.main = async () => {
    try {
        let userStart = 0, userLimit = 20;
        let users;
        while ((users = (await db.collection('user').skip(userStart).limit(userLimit).get()).data) && users.length) {
            for (let i = 0; i < users.length; i++) {
                let user = users[i];
                let reports;

                if ((reports = (await db.collection('report').where({
                    userId: user.openid
                }).get()).data) && reports.length) {
                    let report = reports[0];
                    await db.collection('report').doc(report._id).update({
                            data: await getReport(report.userId)
                        }
                    );
                } else {
                    let report = await getReport(user.openid);
                    report.userId = user.openid;
                    report.meetTime = user.createTime;
                    await db.collection('report').add({
                        data: report
                    })
                }
            }

            if (users.length < userLimit)
                break;

            userStart += userLimit;
        }
    } catch (e) {
        
    }
};

async function getReport(userId) {
    let segment = new Segment();
    segment.useDefault();

    // 树洞数量
    let holeCount = 0;
    // 最长倾诉时间
    let longestDuration = 0;
    // 词频
    let bubbleWordsMap = new Map();

    let words = [];
    // 最晚倾诉时间
    let latestTime = null;
    // 分享树洞数量
    let shareHoleCount = 0;
    // 所有点赞数
    let plusOneCount = 0;

    let holeStart = 0, holeLimit = 20;
    let holes;
    while ((holes = (await db.collection('hole').where({_openid: userId}).skip(holeStart).limit(holeLimit).get()).data)) {
        for (let hole of holes) {
            let bubbleStart = 0, bubbleLimit = 20;
            let bubbles = [];

            while ((bubbles = bubbles.concat((await db.collection('bubble').where({
                holeId: hole._id,
                _openid: userId
            }).skip(bubbleStart).limit(bubbleLimit).get()).data))) {
                if (bubbles.length < bubbleStart + bubbleLimit)
                    break;
                bubbleStart += bubbleLimit;
            }

            bubbles.sort((a, b) => {
                return a.createTime - b.createTime;
            });

            // 倾诉时间计算变量
            let start = 0;
            const minutes = 30;

            // 最晚倾诉时间变量
            const latestStartHour = 22, latestEndHour = 5;

            for (let i = 0; i < bubbles.length; i++) {
                // 计算最长倾诉时间
                if ((i !== 0) && (bubbles[i].createTime.getTime() - bubbles[i - 1].createTime.getTime()) > (minutes * 60 * 1000)) {
                    longestDuration = Math.max(bubbles[i - 1].createTime - bubbles[start].createTime, longestDuration);
                    start = i;
                }

                // 统计词频
                let bubble = bubbles[i];
                if (bubble.type === BubbleType.TEXT) {
                    let words = segment.doSegment(bubble.content, {
                        simple: true,
                        stripPunctuation: true,
                    });
                    words.forEach(word => {
                        if (word !== ' ') {
                            bubbleWordsMap.set(word, bubbleWordsMap.has(word) ? bubbleWordsMap.get(word) + 1 : 1);
                        }
                    })
                }

                // 最晚倾诉时间
                let time = bubble.createTime;
                if (time.getHours() >= latestEndHour || time.getHours() < latestStartHour) {
                    if (!latestTime) {
                        latestTime = time;
                    } else {
                        let h1 = time.getHours(), h2 = latestTime.getHours();
                        if (h1 < latestEndHour)
                            h1 += 24;
                        if (h2 < latestEndHour)
                            h2 += 24;

                        if (h1 * 3600 + time.getMinutes() * 60 + time.getSeconds() >= h2 * 3600 + latestTime.getMinutes() * 60 + latestTime.getSeconds())
                            latestTime = time;
                    }
                }
            }
        }

        holeCount += holes.length;

        if (holes.length < holeLimit)
            break;

        holeStart += holeLimit;
    }

    for (let bubbleWord of bubbleWordsMap) {
        words.push(bubbleWord);
    }

    // 逆序排序
    words.sort((a, b) => {
        return b[1] - a[1];
    });

    let shareHoleStart = 0, shareHoleLimit = 20;
    let shareHoles;
    while ((shareHoles = (await db.collection('share_hole').where({_openid: userId}).skip(shareHoleStart).limit(shareHoleLimit).get()).data)) {
        shareHoles.forEach(shareHole =>
            plusOneCount += shareHole.plusOneCount
        );

        shareHoleCount += shareHoles.length;

        if (shareHoles.length < shareHoleLimit)
            break;

        shareHoleStart += shareHoleLimit;
    }

    return {
        holeCount,
        longestDuration,
        mostUsedWords: words.slice(0, 10),
        latestTime: latestTime ? latestTime.getTime() : 0,
        shareHoleCount,
        plusOneCount
    };
}