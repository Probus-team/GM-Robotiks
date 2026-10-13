# Robot images: sources

Every image here is Pudu Robotics material (product renders, brochure photos or
frames from Pudu's videos). The site credits it as such. Astro builds AVIF and
WebP sizes from these masters; replace a master with a sharper one of the same
model and the page picks it up.

## `src/assets/robots/<id>.webp` — transparent cut-outs

Trimmed to the robot, 1,600 px on the long side at most.

| Robot | Source |
| --- | --- |
| et1 | ET1 product deck (Pudu), subject-lifted with macOS Vision |
| cc1 | Cleaning catalog 2026 (`public/media/docs/pudu-robots-de-limpieza-2026.pdf`), page 6, subject-lifted |
| cc1-pro | Pudu CC1 Pro render (Robotics Galu archive) |
| mt1 | Cleaning catalog 2026, page 10, subject-lifted |
| mt1-max | Pudu MT1 Max render (Robotics Galu archive) |
| mt1-vac | Pudu MT1 Vac render, 2,400 px (Robotics Galu archive) |
| bg1 | Previous site image (`public/media/robots/bg1.webp`), subject-lifted |
| bg1-pro | Pudu BG1 Pro render (Robotics Galu archive). Until now the site reused the BG1 image |
| sh1 | Pudu SH1 render (Robotics Galu archive) |
| t300 | Pudu T300 render (Robotics Galu archive) |
| t600 | Pudu T600 render, both versions (Robotics Galu archive) |
| mp2000 | Pudu MP2000 render (Robotics Galu archive). Replaces the 354 × 387 photo |
| bellabot-pro, bellabot, pudubot-2, kettybot-pro, flashbot-max, gt3, gt5, gt7 | Previous site images, trimmed. No sharper source of the same model was available |

## `src/assets/scenes/<id>.webp` — the robot in context

| Scene | Source |
| --- | --- |
| et1 | ET1 studio render (previously unused `public/media/hero/et1-studio.webp`) |
| cc1, cc1-pro, sh1, bg1-pro | Cleaning catalog 2026, product pages |
| mt1, mt1-vac, bg1, mp2000, t600, gt3, gt7 | Frames from Pudu product videos without captions or third-party logos |
| mt1-max | Pudu studio render |
| bellabot-pro | BellaBot Pro brochure render |
| bellabot, pudubot-2 | Product catalog 2025 (`public/media/docs/pudu-catalogo-productos-2025.pdf`) |
| flashbot-max | FlashBot brochure render |
| t300 | Frame from the T300 case video in `public/media/cases/t300.mp4`, Pudu logo cropped |
| gt5 | Previous site still (`public/media/hero/gt5-field.webp`) |
| pudu-family | Product catalog 2025 cover scene |

The Robotics Galu archive (`galu-redesign/public/src`, local only) holds Pudu
material collected for another Pudu distributor. Only files without Galu
branding were used; Galu's own photos and watermarked video edits were not.
KettyBot images in that archive show the original KettyBot, not the Pro, so
they were not used.
