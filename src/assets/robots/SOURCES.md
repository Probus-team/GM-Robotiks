# Robot images: sources

Every image here is Pudu Robotics material: product renders, brochure images or
frames from Pudu's own videos. The site credits it as such. Masters are stored
as WebP at quality 95 (alpha kept at full quality) at the largest size the
source allows, so the AVIF/WebP that astro:assets makes (`src/lib/image-service.ts`) is
the only pass that costs visible detail. Replace a master with a sharper one of
the same model and the pages pick it up; record the source here.

Sources, by name below:

- **Pudu CDN**: Pudu's website images, `https://cdn.pudutech.com/<file>`, as linked
  from the product pages on pudurobotics.com/en.
- **Pudu YouTube**: the Pudu Robotics channel, downloaded at the best available
  resolution with yt-dlp.
- **Pudu brochure**: an image embedded in a Pudu product brochure, extracted at
  its native resolution with `pdfimages`. The brochures are either GM's own
  (`public/media/docs/`) or copies collected by another Pudu distributor
  (Robotics Galu, local archive `galu-redesign/public/fichasyvideos/<model>/<model>.pdf`).
  Only images without Galu branding were used.
- **Lift**: the robot was cut out of a photo or frame with macOS Vision subject
  lifting, then checked and cleaned by hand on a dark background.

Retouching is limited to what the rows below note: four scenes had a third-party
design-award badge painted out, one had a title line removed, and one cut-out had
a hidden edge rebuilt from its symmetric side. No product detail was added or
removed.

## `src/assets/robots/<id>.webp`: transparent cut-outs

Trimmed to the robot.

| Robot | Size | Source |
| --- | --- | --- |
| et1 | 727×796 | ET1 product deck render (Pudu), lifted. Pudu publishes nothing larger: the ET1 page hero lifts to 698×794 and the film is 1080p |
| cc1 | 881×840 | Lift from Pudu CDN `CC_1_banner_h5_2a6051a037.webp` |
| cc1-pro | 1408×1434 | Lift from Pudu CDN `official-website/product/CC1Pro/S10.mp4` (4K turntable render on black), dark-grey CC1 Pro. The previous file here showed a CC1 |
| mt1 | 2051×1431 | Lift from Pudu YouTube [PUDU MT1 - AI Powered Robotic Sweeper](https://www.youtube.com/watch?v=RczLmqYRAXc), 4K frame at 57.08 s |
| mt1-max | 1033×1359 | Lift from Pudu CDN `PC_198ae18ea2.webp` (3840×2160 render), right-hand robot |
| mt1-vac | 1994×1265 | Pudu render `pudu-mt1-vac-front-right-angle_2400x2400.png` (Robotics Galu archive copy), own transparency |
| bg1 | 772×1030 | Lift from Pudu YouTube [Introducing PUDU BG1 Series](https://www.youtube.com/watch?v=O4bntYbvruo), 4K, end card at 128.6 s (left robot) |
| bg1-pro | 1035×1285 | Lift from the same end-card frame (right robot) |
| sh1 | 644×1600 | Pudu SH1 render (Robotics Galu archive, `105402_3_1-sh1.png`), own transparency |
| t300 | 1101×2146 | Pudu CDN `official-website/pudut300/tab_PUDUT300Standard.png` (5000×3125), own transparency |
| t600 | 1051×968 | Pudu render of the T600 and T600 Underride (Robotics Galu archive). Pudu publishes nothing larger |
| mp2000 | 718×957 | Pudu brochure (Galu archive `mp2000.pdf`, page 4), render plus its own soft mask; baked-in floor glow removed |
| bellabot-pro | 562×1327 | Lift from Pudu CDN `official-website/bellabotpro/S1_1_h5.webp` |
| bellabot | 579×1399 | Lift from Pudu CDN `head_h5_94500f41b5.webp` |
| pudubot-2 | 557×1187 | Lift from Pudu CDN `s1_h5_3945c0a9f7.webp` |
| kettybot-pro | 486×1200 | Lift of the black unit from Pudu CDN `head_h5_3220d6f982.webp`. It overlaps a second unit in the source, so its right edge was rebuilt as a mirror of the left (the body is symmetric) |
| flashbot-max | 686×1213 | Lift from the lossless render in the Pudu brochure (Galu archive `flashbot.pdf`, page 1) |
| gt3 | 1176×940 | Lift from Pudu CDN `E_Nbannerpc_8307d67d78.webp` (8534×2667 GT-series launch banner on the pudurobotics.com home page) |
| gt5 | 1486×1158 | Lift from the same banner |
| gt7 | 1876×1101 | Lift from the same banner |

## `src/assets/scenes/<id>.webp`: the robot in context

| Scene | Size | Source |
| --- | --- | --- |
| et1 | 2880×1620 | Pudu CDN `s1_head_pc_68fc3db77e.webp` (ET1 page hero) |
| cc1 | 2844×1600 | Pudu CDN `CC_1_banner_c828032e7f.webp`; a red dot award badge painted out of the backdrop |
| cc1-pro | 1920×1080 | Pudu YouTube [PUDU CC1 Pro: AI-Powered Autonomous Cleaning Robot](https://www.youtube.com/watch?v=Opu4vDmpAtc), 1080p frame at 20.32 s, supermarket aisle |
| mt1 | 2880×1620 | Pudu YouTube [PUDU MT1 - AI Powered Robotic Sweeper](https://www.youtube.com/watch?v=RczLmqYRAXc), 4K frame at 20.4 s, warehouse aisle |
| mt1-max | 2880×1620 | Pudu CDN `PC_198ae18ea2.webp` (3840×2160 render) |
| mt1-vac | 2880×1620 | Pudu CDN `PC_50e31c6dce.webp` (MT1 Vac key visual) |
| bg1 | 2791×1570 | Pudu YouTube [Introducing PUDU BG1 Series](https://www.youtube.com/watch?v=O4bntYbvruo), 4K end card at 128.6 s, BG1 and BG1 Pro. A title line above the robots was filled in from the plain backdrop |
| bg1-pro | 2880×1620 | Same film, 4K frame at 123.3 s, factory aisle; cropped to leave out a machine maker's brand panel |
| sh1 | 2880×1620 | Pudu CDN `official-website/pudush/screen01/1.webp`; an iF Design Award badge painted out of the floor |
| t300 | 1650×928 | Pudu YouTube [Tri-Robot Team in Lithium-Ion Battery Manufacturing](https://www.youtube.com/watch?v=Jo9HmSl6Q34), 1080p frame at 62.6 s, Pudu logo cropped |
| t600 | 1920×1080 | Pudu CDN `S1_banner_PC_2adf50203c.webp` |
| mp2000 | 2880×1620 | Pudu CDN `s1_head_pc_7b6f7c63ce.webp` |
| bellabot-pro | 2880×1620 | Pudu brochure (Galu archive `bellabot-pro.pdf`, page 1), lobby render |
| bellabot | 2880×1620 | Pudu CDN `head_pc_693fc26cca.webp`; a Good Design Award badge painted out of the floor |
| pudubot-2 | 2880×1620 | Pudu CDN `s1_c915d3b0c9.webp`; an IDEA award badge painted out of the wall |
| kettybot-pro | 2880×1620 | Frame at 10.8 s of Pudu CDN `_ab613de8dc.mp4` (4K café film on the KettyBot Pro page) |
| flashbot-max | 2880×1800 | Pudu brochure (Galu archive `flashbot.pdf`, page 1), full render |
| gt3 | 2880×1620 | Pudu CDN `s1_head_pc_4ff68ee999.webp` |
| gt5 | 2880×1620 | Pudu CDN `s1_head_pc_621c5f87c8.webp`; also the full-width home showcase still |
| gt7 | 2880×1620 | Pudu CDN `s1_head_pc_799074e916.webp` |
| pudu-family | 1800×1012 | Product catalog 2025 cover scene (`public/media/docs/pudu-catalogo-productos-2025.pdf`) |

KettyBot images in the Galu archive show the original KettyBot, not the Pro, so
they were not used. Galu's own photos and watermarked video edits were not used
either.
