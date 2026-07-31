# 证据清单

[English](evidence-manifest.md) · **简体中文** · [日本語](evidence-manifest.ja.md)

有些完成标准从成品报告里根本看不出来。探了几个路径、读了几个客户案例、有没有翻过厂商的视频频道——**这些描述的是调研过程，不是交付物**，只有调研方自己能声明。

所以它们放在一个同名的兄弟文件 `<报告>.evidence.json` 里，**永远不随报告交付**。检查器会自动找到它。

```json
{
  "shape": "自助 SaaS",

  "pathSpace": [
    "sitemap.xml：223 个 URL",
    "robots.txt：7 条 Disallow，8 个 sitemap 声明",
    "llms.txt：404（但载荷里仍有 JSON-LD）"
  ],

  "probedPaths": ["/pricing 200", "/docs 200", "/security 404", "..."],
  "openedIndexPages": ["/pricing（已渲染，逐档点过）", "/limits", "/errors"],
  "caseStudiesRead": ["acme-corp 2026-05", "globex 2026-03", "initech 2025-11"],
  "peerPricingPages": ["a.com/pricing", "b.com/pricing", "c.com/pricing"],
  "videoChannelChecked": "youtube.com/@vendor —— 25 条标题已过，下载 2 条抽帧",

  "skipped": {
    "case-studies": { "reason": "absent", "note": "站点没有客户案例页" }
  }
}
```

## 形态专用的步骤必须靠 `shape` 触发

契约里有三步只对特定形态适用——开源产品的许可证解剖、双边市场的供给侧与需求侧。**它们靠这个字段触发，绝不从报告正文里猜。**

⚠️ 早先的版本用关键词匹配报告正文来推断形态。**"市场"这么常见的一个词，把平台专用的步骤触发到了一份普通 SaaS 报告上。****猜错的代价是假警报，而假警报会让人开始忽略警报。**

没有声明 `shape` 时，这几步一律跳过，检查器会在末尾提示。

## 跳过某一步

只有三个理由。写别的一律记为未达标。

| `reason` | 含义 |
|---|---|
| `blocked` | 降级通道全部试过并失败。**写明试了哪几个、各返回什么。** |
| `absent` | 对象确实不存在——没有移动端就没有应用商店评论 |
| `incapable` | 环境确实做不到。**必须真的试过，并附上命令与报错原文。** |

⚠️ `incapable` 之所以带这句警告：它被连续滥用了五轮——截图那一栏每次都空着，理由都是"环境无渲染能力"，**而一次都没试过**。第六轮一试就成了。

**"没劲了""预算花完了"不在其中。**预算真不够就缩小范围——少查一家竞品——**而不是每一项都做半截**。

## 怎么跑

```bash
node scripts/check-report.mjs report.md                      # 自动找 report.evidence.json
node scripts/check-report.mjs report.md --manifest other.json
```

每一步四种状态：

```
✓ 达标        ✗ 未达标        ? 未声明        ⊘ 已豁免
```

有未达标项或卫生类必修问题时，退出码为 1。
