const express = require("express");
const app = express();

app.use(express.json());

const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

const animals = {
  1: "長距離ランナーのチータ",
  2: "社交家のたぬき",
  3: "落ち着きのない猿",
  4: "フットワークの軽いコアラ",
  5: "面倒見のいい黒ひょう",
  6: "愛情あふれる虎",
  7: "全力疾走するチータ",
  8: "磨き上げられたたぬき",
  9: "大きな志をもった猿",
  10: "母性豊かなコアラ",
  11: "正直なこじか",
  12: "人気者のゾウ",
  13: "ネアカの狼",
  14: "協調性のないひつじ",
  15: "どっしりとした猿",
  16: "コアラの中のコアラ",
  17: "強い意志をもったこじか",
  18: "デリケートなゾウ",
  19: "放浪の狼",
  20: "物静かなひつじ",
  21: "落ち着きのあるペガサス",
  22: "強靭な翼をもつペガサス",
  23: "無邪気なひつじ",
  24: "クリエイティブな狼",
  25: "穏やかな狼",
  26: "粘り強いひつじ",
  27: "波乱に満ちたペガサス",
  28: "優雅なペガサス",
  29: "チャレンジ精神旺盛なひつじ",
  30: "順応性のある狼",
  31: "リーダーとなるゾウ",
  32: "しっかり者のこじか",
  33: "活動的なコアラ",
  34: "気分屋の猿",
  35: "頼られると嬉しいひつじ",
  36: "好感のもたれる狼",
  37: "まっしぐらに突き進むゾウ",
  38: "華やかなこじか",
  39: "夢とロマンのコアラ",
  40: "尽くす猿",
  41: "大器晩成のたぬき",
  42: "足腰の強いチータ",
  43: "動きまわる虎",
  44: "情熱的な黒ひょう",
  45: "サービス精神旺盛なコアラ",
  46: "守りの猿",
  47: "人間味あふれるたぬき",
  48: "品格のあるチータ",
  49: "ゆったりとした悠然の虎",
  50: "落ち込みの激しい黒ひょう",
  51: "我が道を行くライオン",
  52: "統率力のあるライオン",
  53: "感情的なライオン",
  54: "傷つきやすいライオン",
  55: "パワフルな虎",
  56: "気取らない黒ひょう",
  57: "感情豊かな黒ひょう",
  58: "束縛を嫌う黒ひょう",
  59: "慈悲深い虎",
  60: "愛情深いライオン"
};
function calculateAnimalNumber(input) {
  const clean = input.replace(/[^0-9]/g, "");

  if (clean.length !== 8) {
    return null;
  }

  const year = Number(clean.slice(0, 4));
  const month = Number(clean.slice(4, 6));
  const day = Number(clean.slice(6, 8));

  const birthday = new Date(Date.UTC(year, month - 1, day));

  if (
    birthday.getUTCFullYear() !== year ||
    birthday.getUTCMonth() !== month - 1 ||
    birthday.getUTCDate() !== day
  ) {
    return null;
  }

  const baseDate = new Date(Date.UTC(1970, 0, 1));
  const diffDays = Math.floor((birthday - baseDate) / 86400000);

  const number = ((diffDays + 17) % 60) + 1;

  return number;
}

async function replyMessage(replyToken, text) {
  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${CHANNEL_ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      replyToken: replyToken,
      messages: [
        {
          type: "text",
          text: text
        }
      ]
    })
  });
}

app.post("/webhook", async (req, res) => {
  const events = req.body.events || [];

  for (const event of events) {
    if (event.type === "message" && event.message.type === "text") {
      const userText = event.message.text;
      const number = calculateAnimalNumber(userText);

      let replyText = "";

      if (number) {
        const animal = animals[number];

        replyText =
          `診断結果は…\n\n` +
          `あなたは【${number}番】\n` +
          `「${animal}」タイプです！`;
      } else {
        replyText =
          "生年月日を8桁で送ってください。\n\n" +
          "例：19910816";
      }

      await replyMessage(event.replyToken, replyText);
    }
  }

  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("LINE BOT OK");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
