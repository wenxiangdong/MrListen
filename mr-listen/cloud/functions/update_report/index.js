// 云函数入口文件
const cloud = require('wx-server-sdk');
const nodejieba = require('nodejieba');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async () => {
    let userCollection = db.collection('user');
    let reportCollection = db.collection('report');
    let userStart = 0, userLimit = 20;
    let users;
    while ((users = userCollection.skip(userStart).limit(userLimit).get().data)) {
        users.forEach(async user => {
            let reports = reportCollection.where({
                openid: user.openid,
            }).get().data;

            if (reports.length) {
                let report = reports[0];
                await set(report);
            } else {
                let report = {
                    openid: user.openid,
                    meetTime: user.createTime,
                };
                await set(report);
            }
        });

        if (users.length < userLimit)
            break;

        userStart += userLimit;
    }
};

async function set(report) {
    // 树洞数量
    let holeCount = 0;
    // 最长倾诉时间
    let longestDuration = 0;
    // 词频
    let bubbleWordsMap = new Map();
    // 最晚倾诉时间
    let latestTime = null;
    // 所有点赞数
    let plusOneCount = 0;

    let holeCollection = db.collection('hole').where({_openid: user.openid});
    let holeStart = 0, holeLimit = 20;
    let holes;
    while ((holes = holeCollection.skip(holeStart).limit(holeLimit).get().data)) {
        for (let hole of holes) {
            let bubbleCollection = db.collection('bubble').where({holeId: hole._id});
            let bubbleStart = 0, bubbleLimit = 20;
            let bubbles = [];

            while ((bubbles = bubbles.concat(bubbleCollection.skip(bubbleStart).limit(bubbleLimit).get().data))) {
                if (bubbles.length < bubbleStart + bubbleLimit)
                    break;
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
                if (bubble.type === 'TEXT') {
                    let str = bubble.content.replace(/[]/g, ' ');
                    let words = nodejieba.cut(str, true);
                    words.forEach(word => {
                        if (word !== ' ') {
                            bubbleWordsMap.set(word, bubbleWordsMap.has(word) ? bubbleWordsMap.get(word) + 1 : 1);
                        }
                    })
                }

                // 最晚倾诉时间
                let time = bubble.createTime;
                if (time.getHours() >= latestEndHour || time.getHours < latestStartHour) {
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
            holeCount += holes.length;

            if (holes.length < holeLimit)
                break;
        }
    }

    let words = [];
    for (let bubbleWord of bubbleWordsMap) {
        words.push(bubbleWord);
    }

    // 逆序排序
    words.sort((a, b) => {
        return b[1] - a[1];
    });

    let shareHoleCollection = db.collection('share_hole').where({_openid: user.openid});
    let shareHoleStart = 0, shareHoleLimit = 20;
    let shareHoles;
    while ((shareHoles = shareHoleCollection.skip(shareHoleStart).limit(shareHoleLimit).get().data)) {
        shareHoles.forEach(shareHole =>
            plusOneCount += shareHole.plusOneCount
        );

        if (shareHoles.length < shareHoleLimit)
            break;
    }

    report.holeCount = holeCount;
    report.longestDuration = longestDuration;
    report.mostUsedWords = words.slice(0, 10);
    report.latestTime = latestTime ? latestTime.getTime() : 0;
    report.plusOneCount = plusOneCount;
}