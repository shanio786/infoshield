import { db } from "@workspace/db";
import {
  modulesTable,
  lessonsTable,
  quizzesTable,
  quizQuestionsTable,
  badgesTable,
  caseStudiesTable,
  forumPostsTable,
  forumRepliesTable,
} from "@workspace/db/schema";

async function seed() {
  console.log("Seeding InfoShield database...");

  const existingModules = await db.select().from(modulesTable);
  if (existingModules.length > 0) {
    console.log("Database already seeded. Skipping.");
    process.exit(0);
  }

  const modules = await db
    .insert(modulesTable)
    .values([
      {
        title: "Understanding Misinformation",
        description: "Learn what misinformation and disinformation are, how they differ, and why they matter in today's digital landscape.",
        level: 1,
        icon: "BookOpen",
        estimatedMinutes: 20,
      },
      {
        title: "How False Information Spreads",
        description: "Explore the mechanisms behind viral misinformation — social media algorithms, emotional triggers, and network effects.",
        level: 2,
        icon: "Share2",
        estimatedMinutes: 25,
      },
      {
        title: "AI, Deepfakes & Synthetic Media",
        description: "Discover how artificial intelligence is being used to create convincing fake content and how to spot it.",
        level: 3,
        icon: "Cpu",
        estimatedMinutes: 30,
      },
      {
        title: "Electoral Disinformation in Australia",
        description: "Examine real Australian election case studies including the 2019 Death Tax campaign and 2023 AEC referendum attacks.",
        level: 4,
        icon: "Flag",
        estimatedMinutes: 35,
      },
      {
        title: "Coordinated Influence Operations",
        description: "Advanced module covering state-sponsored campaigns, bot networks, and coordinated inauthentic behaviour.",
        level: 5,
        icon: "Network",
        estimatedMinutes: 40,
      },
    ])
    .returning();

  console.log(`Created ${modules.length} modules`);

  await db.insert(lessonsTable).values([
    // Module 1
    {
      moduleId: modules[0].id,
      title: "What is Misinformation?",
      content: `# What is Misinformation?

Misinformation refers to **false or inaccurate information** that is spread regardless of intent. The person sharing it may genuinely believe it to be true.

## Key Definitions

**Misinformation** — False information spread without intent to deceive. Example: Someone shares a health myth they believe is real.

**Disinformation** — False information spread deliberately to deceive or manipulate. Example: A political campaign deliberately fabricating a story about a rival.

**Malinformation** — True information used with harmful intent. Example: Leaking private information to damage someone.

## Why It Matters

Research from MIT Media Lab shows that **false news spreads 6 times faster** than true news on social media platforms. This is because misinformation is often:
- More emotionally arousing
- More novel and surprising  
- More shareable

## The Information Environment

We live in an era of information abundance — but quantity doesn't equal quality. With billions of posts published daily, distinguishing fact from fiction has become a critical skill.

> "The greatest enemy of knowledge is not ignorance — it is the illusion of knowledge." — Stephen Hawking`,
      orderIndex: 0,
      estimatedMinutes: 8,
    },
    {
      moduleId: modules[0].id,
      title: "Types of Manipulated Content",
      content: `# Types of Manipulated Content

Not all false content is created equal. Researchers have identified **seven categories** of problematic information.

## The Spectrum

### 1. Satire or Parody
Content that mimics real news for humour but has no intent to deceive. Risk: People may share without realising it's satire.

### 2. Misleading Content
Misleading use of real information to frame an issue — e.g., cherry-picking statistics.

### 3. Imposter Content
Genuine sources being impersonated — fake ABC News accounts, forged government documents.

### 4. Fabricated Content
100% false content designed to deceive and cause harm.

### 5. False Connection
Headlines, visuals, or captions that don't support the content — "clickbait."

### 6. False Context
Genuine content shared with false contextual information — an old photo presented as today's news.

### 7. Manipulated Content
Genuine images or video that have been altered — e.g., cropping a photo to change meaning.

## Real Example
During the 2020 Australian bushfires, a 2019 NASA satellite image was widely shared as "today's fires" — this is **False Context**.`,
      orderIndex: 1,
      estimatedMinutes: 10,
    },
    {
      moduleId: modules[0].id,
      title: "The Psychology of Belief",
      content: `# The Psychology of Belief

Understanding why people believe misinformation is crucial to combating it.

## Cognitive Biases

### Confirmation Bias
We tend to accept information that confirms our existing beliefs and reject information that challenges them. This is the most powerful driver of misinformation acceptance.

### The Illusory Truth Effect
Simply repeating a statement makes people more likely to believe it — even if it's false. This is why politicians and propagandists repeat talking points constantly.

### Emotional Reasoning
When we feel strongly about something, we're more likely to believe related information — even without evidence.

### Source Heuristics
People often judge content by its source rather than its content. If a trusted friend shares something, we're less critical of it.

## The SIFT Method
A practical tool for evaluating information:

- **S**top — Pause before sharing
- **I**nvestigate the source
- **F**ind better coverage  
- **T**race claims back to original context`,
      orderIndex: 2,
      estimatedMinutes: 8,
    },
    // Module 2
    {
      moduleId: modules[1].id,
      title: "Social Media Algorithms",
      content: `# Social Media Algorithms and Misinformation

Social media platforms use algorithms designed to maximise engagement — but engagement and accuracy are often in conflict.

## How Algorithms Work

Platforms like Facebook, Twitter/X, and YouTube use machine learning models to predict which content will generate the most interaction (likes, shares, comments, time spent).

**The problem:** Emotionally charged, outrage-inducing content generates more interaction — and misinformation tends to be more emotionally provocative than accurate news.

## The Engagement Loop

1. User engages with political content
2. Algorithm shows more political content
3. Content becomes more extreme to maintain engagement  
4. User enters an information "filter bubble"

## Research Evidence

A 2021 Facebook internal study (leaked via whistleblower Frances Haugen) found that:
- Misinformation was 6x more likely to be shared than corrections
- The platform's algorithm amplified divisive and extreme content
- Removing the algorithm reduced political content but also reduced engagement

## The Australian Context

During Australia's 2019 election, the Death Tax misinformation spread primarily through:
- Facebook Groups (shared by political actors and bots)
- YouTube videos (reached 1+ million views)
- WhatsApp private messages (difficult to trace and moderate)`,
      orderIndex: 0,
      estimatedMinutes: 12,
    },
    {
      moduleId: modules[1].id,
      title: "Emotional Triggers and Viral Spread",
      content: `# Emotional Triggers and Viral Spread

Misinformation exploits our emotions to spread rapidly.

## The Six Emotional Triggers

Research identifies six core emotions that drive sharing behaviour:

1. **Anger** — Outrage about perceived injustice drives rapid sharing
2. **Fear** — Threats to safety or security compel urgent sharing  
3. **Disgust** — Content that violates moral norms spreads quickly
4. **Surprise** — Novel or shocking information is highly shareable
5. **Anxiety** — Uncertainty about the future drives information seeking
6. **Hope** — Inspirational (sometimes false) stories also spread widely

## The Moral Outrage Engine

Research from NYU found that every additional "moral-emotional" word in a tweet increased the rate of retweets by **20%**.

Misinformation creators exploit this by crafting messages that hit moral outrage buttons — they don't need to be true, they need to feel important.

## Case Study: The Death Tax

The 2019 "Death Tax" misinformation worked because it triggered:
- **Fear** — of losing inheritance
- **Anger** — at the Labor Party
- **Urgency** — "Share before the election"

This emotional cocktail made it highly shareable — even among people who would check facts in other contexts.`,
      orderIndex: 1,
      estimatedMinutes: 10,
    },
    // Module 3
    {
      moduleId: modules[2].id,
      title: "What Are Deepfakes?",
      content: `# What Are Deepfakes?

Deepfakes are AI-generated synthetic media — videos, images, or audio — that are designed to look or sound like real people saying or doing things they never did.

## How Deepfakes Work

Modern deepfakes use a technique called **Generative Adversarial Networks (GANs)**:

1. A "generator" network creates fake media
2. A "discriminator" network tries to detect fakes
3. Both networks improve through competition
4. Result: increasingly convincing synthetic content

## The Detection Challenge

Early deepfakes were detectable by:
- Blinking irregularities
- Lighting inconsistencies
- Unnatural facial movements

Modern deepfakes have overcome these tells. Detection now requires:
- Metadata analysis
- Forensic pixel analysis
- AI-based detection tools

## The Political Risk

A realistic deepfake of a politician could:
- Spread damaging false statements
- Appear to show crimes they didn't commit
- Sow confusion during elections
- Undermine trust in authentic footage

> Even if debunked, a deepfake can cause lasting reputational damage — the correction rarely travels as far as the original.`,
      orderIndex: 0,
      estimatedMinutes: 12,
    },
    // Module 4
    {
      moduleId: modules[3].id,
      title: "The 2019 Death Tax Campaign",
      content: `# The 2019 Death Tax Disinformation Campaign

The "Death Tax" campaign is one of Australia's most studied cases of electoral disinformation.

## What Was the Claim?

In the lead-up to the May 2019 federal election, a viral claim spread across social media: that the Australian Labor Party planned to introduce an **inheritance tax** (a "death tax") if elected.

This claim was **entirely fabricated**. Labor had no such policy.

## How It Spread

The campaign began on fringe Facebook pages and spread through:

1. **Facebook Groups** — Shared in political and community groups
2. **YouTube Videos** — Reached over 1 million views
3. **WhatsApp Messages** — Forwarded privately, impossible to trace
4. **Political Amplification** — Some Coalition supporters and minor party figures shared the claims

## Why It Was Effective

- **Emotional resonance** — Inheritance is deeply personal and emotionally charged
- **Plausible framing** — Mixed with real Labor policies (franking credits) to seem credible
- **Targeted demographics** — Especially effective among retirees and small business owners
- **Election timing** — Spread in final weeks when scrutiny was highest but corrections were hard to penetrate

## The Impact

Researchers found the campaign had measurable impact on voter behaviour, particularly in Queensland. Whether it decided the election result remains debated — but its influence on public discourse is undeniable.

## Lessons

1. Electoral misinformation doesn't need to be sophisticated to be effective
2. Private messaging platforms are particularly resistant to correction
3. Emotional targeting can bypass rational fact-checking`,
      orderIndex: 0,
      estimatedMinutes: 15,
    },
    {
      moduleId: modules[3].id,
      title: "The 2023 AEC Referendum Attacks",
      content: `# The 2023 Indigenous Voice Referendum Disinformation

The 2023 referendum on the Indigenous Voice to Parliament became a target of significant coordinated disinformation.

## Background

On October 14, 2023, Australians voted on whether to establish an Aboriginal and Torres Strait Islander Voice to Parliament and Executive Government. The referendum resulted in a "No" vote.

## Key Disinformation Campaigns

### The #voteoften Campaign
A viral social media campaign falsely claimed Australians could vote multiple times in the referendum. The AEC and multiple fact-checkers debunked this, but it spread widely — even being repeated by some public figures.

### Voter Roll Manipulation Claims
False claims circulated that the voter roll was being manipulated or that the count could not be trusted.

### AEC Legitimacy Attacks
The Australian Electoral Commission itself was targeted with claims that it was biased or compromised.

## The AEC's Response

The AEC mounted an unprecedented communication campaign to counter misinformation:
- Direct social media rebuttals
- Partnership with Meta and Twitter/X  
- Public fact-checking resources

## Research Findings

While general trust in the AEC remained high, studies found that exposure to the disinformation **reduced confidence** in the referendum process — even among people who ultimately voted.

This demonstrates a key insight: **disinformation doesn't need to be believed to cause harm** — it only needs to create doubt.`,
      orderIndex: 1,
      estimatedMinutes: 15,
    },
    // Module 5
    {
      moduleId: modules[4].id,
      title: "What Are Coordinated Influence Operations?",
      content: `# Coordinated Influence Operations

Coordinated Influence Operations (CIOs) are organised campaigns that manipulate online discourse through inauthentic behaviour — often at scale, sometimes with state backing.

## Key Characteristics

Unlike individual misinformation sharing, CIOs are:

- **Coordinated** — Multiple accounts working together
- **Inauthentic** — Accounts misrepresent their true identity or origin
- **Scaled** — Use automation (bots) to amplify at scale
- **Strategic** — Serve political, economic, or ideological goals

## Common Tactics

### Bot Networks
Automated accounts that rapidly like, share, and amplify target content to game social media algorithms.

### Sockpuppet Accounts
Fake human personas that appear to be genuine community members but are controlled by the operation.

### Astroturfing
Creating the illusion of grassroots support for a position — "manufacturing consent."

### Strategic Amplification
Targeting real divisions in society and amplifying them beyond their natural prevalence.

## The Attribution Problem

Identifying the source of a CIO is extremely difficult:
- VPNs and proxies mask origins
- Shared tactics across different groups
- Deniability is built into operations

## Australian Examples

Several studies have identified potential CIO activity targeting Australian political discourse, though attribution remains contested in most cases.`,
      orderIndex: 0,
      estimatedMinutes: 15,
    },
  ]);

  console.log("Created lessons");

  const quizzes = await db
    .insert(quizzesTable)
    .values([
      {
        moduleId: modules[0].id,
        title: "Misinformation Fundamentals Quiz",
        description: "Test your understanding of the basics of misinformation and disinformation.",
        passingScore: 70,
      },
      {
        moduleId: modules[1].id,
        title: "Viral Spread & Algorithms Quiz",
        description: "Challenge your knowledge of how false information spreads online.",
        passingScore: 70,
      },
      {
        moduleId: modules[3].id,
        title: "Australian Electoral Disinformation Quiz",
        description: "Test your knowledge of real Australian disinformation cases.",
        passingScore: 70,
      },
    ])
    .returning();

  await db.insert(quizQuestionsTable).values([
    // Quiz 1
    {
      quizId: quizzes[0].id,
      question: "A friend shares a health claim on Facebook that turns out to be false. They genuinely believed it was true. This is an example of:",
      options: ["Disinformation", "Misinformation", "Malinformation", "Propaganda"],
      correctOption: 1,
      explanation: "Misinformation is false information shared without intent to deceive. Your friend believed it was true, making this misinformation — not disinformation (which requires deliberate deception).",
      hint: "Think about whether the person sharing knew it was false.",
      orderIndex: 0,
    },
    {
      quizId: quizzes[0].id,
      question: "Research from MIT Media Lab found that false news on Twitter spreads:",
      options: ["At the same rate as true news", "Slower than true news", "6 times faster than true news", "10 times faster than true news"],
      correctOption: 2,
      explanation: "The MIT Media Lab study found false news spreads 6x faster than true news on social media, largely because it tends to be more novel and emotionally engaging.",
      hint: "The number is surprisingly high.",
      orderIndex: 1,
    },
    {
      quizId: quizzes[0].id,
      question: "An old photo from 2017 is shared on social media claiming to show 'today's protests'. Which category of misleading content does this represent?",
      options: ["Fabricated Content", "False Context", "Satire", "Misleading Content"],
      correctOption: 1,
      explanation: "False Context occurs when genuine content is shared with false contextual information — in this case, a real photo presented as if it's from today when it's actually years old.",
      hint: "The photo itself is real — but the context is wrong.",
      orderIndex: 2,
    },
    {
      quizId: quizzes[0].id,
      question: "Which cognitive bias describes our tendency to accept information that confirms what we already believe?",
      options: ["Illusory Truth Effect", "Confirmation Bias", "Anchoring Bias", "Availability Heuristic"],
      correctOption: 1,
      explanation: "Confirmation bias is our tendency to search for, interpret, and remember information in a way that confirms our pre-existing beliefs. It's one of the most powerful drivers of misinformation acceptance.",
      hint: "It's about confirming what you already think.",
      orderIndex: 3,
    },
    // Quiz 2
    {
      quizId: quizzes[1].id,
      question: "Social media algorithms are primarily designed to optimise for:",
      options: ["Accuracy of information", "User engagement and time spent", "Balanced political views", "Verified sources"],
      correctOption: 1,
      explanation: "Social media platforms design their algorithms to maximise engagement metrics (likes, shares, comments, time spent) because these drive advertising revenue. This creates a conflict with accuracy, since emotional and outrage-inducing content often generates more engagement.",
      hint: "Think about what makes money for the platform.",
      orderIndex: 0,
    },
    {
      quizId: quizzes[1].id,
      question: "According to NYU research, adding 'moral-emotional' words to a tweet increases retweet rate by approximately:",
      options: ["5%", "10%", "20%", "50%"],
      correctOption: 2,
      explanation: "NYU researchers found that every additional moral-emotional word in a tweet increased its retweet rate by 20%. This is why misinformation creators craft messages with strong moral and emotional language.",
      hint: "It's a significant but not extreme percentage.",
      orderIndex: 1,
    },
    {
      quizId: quizzes[1].id,
      question: "During the 2019 Australian Death Tax campaign, which emotion was MOST directly targeted to drive sharing?",
      options: ["Hope", "Disgust", "Fear about losing inheritance", "Surprise"],
      correctOption: 2,
      explanation: "The Death Tax campaign primarily targeted fear — specifically, fear that Labor would take away people's inheritance through a 'death tax'. This personal financial threat was deeply emotionally resonant for its target audience.",
      hint: "Think about what the claim was about.",
      orderIndex: 2,
    },
    // Quiz 3
    {
      quizId: quizzes[2].id,
      question: "The '2019 Death Tax' claim about the Labor Party was:",
      options: ["Partially true — Labor considered it", "Entirely fabricated — Labor had no such policy", "True — Labor planned a small inheritance tax", "Based on an old policy that was reversed"],
      correctOption: 1,
      explanation: "The Death Tax claim was entirely fabricated. The Labor Party had no inheritance tax policy. The claim was a deliberate disinformation campaign designed to damage Labor's electoral prospects.",
      hint: "It was completely made up.",
      orderIndex: 0,
    },
    {
      quizId: quizzes[2].id,
      question: "The #voteoften campaign during the 2023 Voice referendum falsely claimed that:",
      options: ["The referendum was illegal", "Australians could vote multiple times", "The AEC was biased toward Yes", "The voter roll contained millions of fake names"],
      correctOption: 1,
      explanation: "The #voteoften campaign spread the false claim that Australians could vote multiple times in the referendum. This was entirely false — Australia has strict voter authentication systems. The AEC had to issue multiple rebuttals.",
      hint: "It relates to how many times you could vote.",
      orderIndex: 1,
    },
    {
      quizId: quizzes[2].id,
      question: "According to research on the 2023 referendum, exposure to disinformation about the AEC:",
      options: [
        "Had no measurable effect on public opinion",
        "Caused most people to distrust the AEC",
        "Reduced confidence in the process even among people who ultimately voted",
        "Only affected people who voted No",
      ],
      correctOption: 2,
      explanation: "Research found that even people who participated in the vote showed reduced confidence in the referendum process after exposure to disinformation — demonstrating that disinformation doesn't need to be fully believed to cause harm. Sowing doubt is enough.",
      hint: "Disinformation can harm even when people don't fully believe it.",
      orderIndex: 2,
    },
  ]);

  console.log("Created quizzes and questions");

  await db.insert(badgesTable).values([
    {
      name: "Perfect Score",
      description: "Achieved 100% on a quiz",
      icon: "Star",
      rarity: "rare",
      xpValue: 100,
    },
    {
      name: "First Steps",
      description: "Completed your first lesson",
      icon: "BookOpen",
      rarity: "common",
      xpValue: 25,
    },
    {
      name: "Quiz Champion",
      description: "Passed 3 or more quizzes",
      icon: "Trophy",
      rarity: "uncommon",
      xpValue: 75,
    },
    {
      name: "Deep Diver",
      description: "Completed an entire module",
      icon: "Award",
      rarity: "uncommon",
      xpValue: 60,
    },
    {
      name: "Fact Guardian",
      description: "Completed all 5 learning modules",
      icon: "Shield",
      rarity: "legendary",
      xpValue: 500,
    },
    {
      name: "Forum Voice",
      description: "Made your first forum post",
      icon: "MessageCircle",
      rarity: "common",
      xpValue: 30,
    },
    {
      name: "Critical Thinker",
      description: "Scored above 90% on 2 quizzes",
      icon: "Brain",
      rarity: "rare",
      xpValue: 150,
    },
  ]);

  console.log("Created badges");

  await db.insert(caseStudiesTable).values([
    {
      slug: "death-tax-2019",
      title: "The 2019 Death Tax Campaign",
      subtitle: "How a fabricated inheritance tax claim shaped an Australian federal election",
      year: 2019,
      category: "Electoral Disinformation",
      summary: "In the lead-up to the May 2019 Australian federal election, a viral disinformation campaign falsely claimed that the Labor Party planned to introduce a 'death tax' on inheritance. The claim was entirely fabricated but spread rapidly via Facebook, YouTube, and WhatsApp — reaching millions of Australians.",
      content: `## Background

The 2019 Australian Federal Election was contested between the incumbent Coalition government led by Scott Morrison and the Labor Party led by Bill Shorten. Labor entered the campaign as polling favourite.

## The Disinformation Campaign

In the weeks before the election, a viral claim spread across social media: that Labor planned to introduce an inheritance tax — a "death tax" — on estates passed to children.

**The claim was false.** Labor had no such policy.

The campaign originated from fringe Facebook pages and political actors opposed to Labor. Key characteristics:

- **Fabricated Policy**: The "death tax" policy was invented — Labor had not proposed it, discussed it, or had it in any policy document
- **Emotional Targeting**: Inheritance is deeply personal; the claim triggered fear about financial security
- **Strategic Timing**: Released in final campaign weeks when corrections had less time to spread
- **Platform Mix**: Spread across Facebook Groups, YouTube videos (1M+ views), and WhatsApp chains

## Why It Spread

The campaign exploited several vulnerabilities:

1. **Plausibility**: Labor's real franking credits policy involved complex tax changes — this made the "death tax" seem plausible
2. **Target Demographics**: Particularly effective among retirees and small business owners
3. **Private Channels**: WhatsApp messages can't be moderated or corrected by platforms
4. **Emotional Intensity**: Financial fear drives sharing even among normally fact-conscious people

## Media Coverage

The campaign was reported by Australian media, and multiple fact-checking organisations (RMIT FactLab, AAP FactCheck) debunked it. However, corrections typically don't reach the same audience as the original claim.

## Political Dimensions

Several figures aligned with opposing parties shared or amplified the claims. The blurring of organic sharing with potential coordination makes attribution difficult.

## Impact and Outcome

The Coalition won the 2019 election in what was widely described as a "miracle" win given pre-election polling. Whether the Death Tax disinformation influenced the result is debated, but its impact on political discourse is undeniable.

Researchers found measurable belief in the false claim among voters, particularly in Queensland where the campaign had significant reach.`,
      impact: "The campaign demonstrated that electoral disinformation doesn't require sophistication — simple, emotionally resonant false claims spread via social networks can have significant electoral impact. It exposed the vulnerability of unmoderated private messaging platforms to influence campaigns.",
      lessons: [
        "Simple emotional lies can outperform sophisticated accurate information",
        "Private messaging platforms are particularly vulnerable to uncorrectable misinformation",
        "Electoral timing creates urgency that suppresses fact-checking behaviour",
        "Plausibility matters — mixing false claims with real policies boosts credibility",
        "Corrections rarely reach the same audience as original misinformation",
      ],
      sources: [
        "Warren, M. (2020). 'Death tax' and the political messaging that may have changed the election. The Conversation.",
        "RMIT FactLab (2019). Fact check: Did Labor plan to introduce a death tax?",
        "AAP FactCheck (2019). Scott Morrison's death tax claims are false.",
        "Australian Electoral Commission (2019). Electoral Backgrounders: Truth in Political Advertising.",
      ],
    },
    {
      slug: "aec-referendum-2023",
      title: "The 2023 Voice Referendum Disinformation",
      subtitle: "How the Australian Electoral Commission became a target of coordinated online attacks",
      year: 2023,
      category: "Institutional Disinformation",
      summary: "During the 2023 Australian referendum on the Indigenous Voice to Parliament, the AEC and the democratic process itself became targets of disinformation campaigns — including false claims that voters could cast multiple ballots and that the AEC was biased.",
      content: `## Background

On 14 October 2023, Australians voted in a referendum to decide whether to alter the Australian Constitution to establish an Aboriginal and Torres Strait Islander Voice to Parliament and Executive Government. The referendum resulted in a "No" vote (60.06% against).

## The Disinformation Landscape

Unlike many electoral disinformation campaigns focused on policy fabrications, the 2023 referendum saw attacks on the electoral process and its administrators.

## Key Campaigns

### The #voteoften Hashtag

A viral social media campaign spread the false claim that Australians could vote multiple times in the referendum. Posts encouraged people to "vote often" with instructions for doing so.

**The facts**: Australia has a robust voter identification system. Each voter is marked off the electoral roll when they receive their ballot. Multiple voting is a criminal offence. The claim was factually impossible.

The AEC issued multiple rebuttals. The claim was repeated by some public figures before being corrected, amplifying its spread.

### AEC Legitimacy Attacks

Claims circulated on social media — primarily on Twitter/X — that:
- The AEC was biased toward the Yes campaign
- The voter roll contained fraudulent entries
- The count could not be trusted
- Electoral officials were compromised

None of these claims were substantiated. The AEC is an independent statutory authority with a long record of credible election administration.

### Coordinated Amplification

Some researchers noted patterns of coordinated amplification around referendum disinformation — accounts with limited history suddenly becoming active, similar posting patterns across multiple accounts.

## The AEC's Response

The AEC mounted its most significant public communications campaign in response:

- Real-time social media monitoring and rebuttal
- Partnership with Meta, Twitter/X, and TikTok
- Public fact-checking resources
- Proactive media engagement

## Research Findings

Studies conducted after the referendum found:

- **Belief rates**: A significant minority of Australians believed at least one of the false claims
- **Trust impact**: Even among non-believers, exposure to institutional attacks reduced stated confidence in the process
- **Asymmetric correction**: Corrections by the AEC reached far fewer people than the original false claims
- **Demographic variation**: Younger, more digitally active Australians were more exposed to the disinformation

## The "Doubt Without Belief" Effect

A critical finding: **disinformation about the AEC was harmful even when people didn't fully believe it.**

This demonstrates what researchers call the "doubt without belief" effect — creating uncertainty about institutions is itself a form of harm, even if the specific false claim is rejected.

When voters say "I don't know if I can trust the count" — even if they ultimately voted — this represents a corrosion of democratic confidence that doesn't require full belief in any specific lie.`,
      impact: "The campaign revealed that democratic institutions themselves — not just policies or candidates — are now legitimate targets of disinformation. The AEC attacks demonstrated that undermining trust in electoral administration is a viable strategy, independent of any specific electoral outcome.",
      lessons: [
        "Institutional trust can be damaged even when specific claims are rejected",
        "Electoral administrators need robust communications strategies, not just accurate information",
        "Platform partnerships are essential but insufficient for containing viral institutional attacks",
        "The 'doubt without belief' effect means disinformation success is not binary",
        "Referendum campaigns create particularly high emotional stakes that amplify disinformation spread",
      ],
      sources: [
        "Australian Electoral Commission (2023). Voice Referendum Report.",
        "Tully, M. & Carson, A. (2024). Disinformation and the 2023 Voice Referendum. University of Melbourne.",
        "RMIT FactLab (2023). Fact-checking the Voice Referendum.",
        "Reuters Institute for the Study of Journalism (2024). Digital News Report: Australia.",
      ],
    },
  ]);

  console.log("Created case studies");

  await db.insert(forumPostsTable).values([
    {
      userId: "user_demo_1",
      authorName: "Sarah M.",
      title: "The Death Tax example really surprised me",
      content: "I just finished Module 4 and I was genuinely shocked that the Death Tax claim was 100% fabricated. I actually remember hearing about it in 2019 and I'm not sure I fully disbelieved it at the time. How do we train ourselves to pause and verify in the moment when we're emotionally engaged with an issue?",
    },
    {
      userId: "user_demo_2",
      authorName: "James T.",
      title: "Question about the SIFT method",
      content: "The SIFT method introduced in Module 1 is really practical. Has anyone been using it in their daily news consumption? I've started applying it but find the 'Find better coverage' step often leads me down a rabbit hole. Any tips for efficient source verification without spending 20 minutes on every article?",
    },
    {
      userId: "user_demo_3",
      authorName: "Priya K.",
      title: "Deepfakes are scarier than I thought",
      content: "After completing Module 3, I went looking for examples of deepfakes online and I genuinely couldn't tell some of them were fake at first viewing. The technology has advanced so fast. What practical checks can non-technical people use when encountering suspicious video content?",
    },
  ]);

  const posts = await db.select().from(forumPostsTable);
  if (posts.length > 0) {
    await db.insert(forumRepliesTable).values([
      {
        postId: posts[0].id,
        userId: "user_demo_4",
        authorName: "Alex R.",
        content: "This is such a common experience! The key insight for me was that even very media-literate people are vulnerable when they're emotionally engaged. The pause in SIFT is so important — just a 3 second delay before sharing can make a huge difference. I've been trying to ask myself 'what emotion am I feeling right now?' before sharing anything political.",
      },
      {
        postId: posts[1].id,
        userId: "user_demo_5",
        authorName: "Lena W.",
        content: "For efficient source checking, I use the 'lateral reading' technique — rather than reading the article deeply, I open new tabs to search for what others say about the source and the claim. Fact-checking sites like RMIT FactLab and AAP FactCheck are great starting points for Australian content specifically.",
      },
    ]);
  }

  console.log("Created forum posts and replies");
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
