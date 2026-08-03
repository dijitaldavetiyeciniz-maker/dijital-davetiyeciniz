# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: part3-flagship-templates.spec.ts >> PART 3 — Flagship Collection Templates & Visual Quality Tests >> Action button order MUST remain constant: 1. Takvime Ekle, 2. Konum, 3. LCV, 4. Fotoğraf
- Location: tests\part3-flagship-templates.spec.ts:36:7

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic:
    - generic:
      - generic:
        - generic:
          - generic:
            - heading "Une Soirée Élégante" [level=3]
            - heading "Elif Yılmaz & Kerem Arslan" [level=1]:
              - text: Elif Yılmaz
              - text: "&"
              - text: Kerem Arslan
            - generic:
              - paragraph: 12 Eylül 2026
              - paragraph: 22:30
            - generic:
              - img
              - heading "Çırağan Palace Kempinski" [level=4]
              - paragraph: Beşiktaş, İstanbul
            - generic:
              - generic:
                - generic:
                  - generic: "40"
                  - generic: Gün
                - generic: /
                - generic:
                  - generic: "08"
                  - generic: Saat
                - generic: /
                - generic:
                  - generic: "19"
                  - generic: Dakika
                - generic: /
                - generic:
                  - generic: "33"
                  - generic: Saniye
            - generic:
              - generic:
                - button "Takvime Ekle":
                  - generic:
                    - img
                  - generic: Takvim
                - button "Konuma Git":
                  - generic:
                    - img
                  - generic: Konum
                - button "Katılım Bildir":
                  - generic:
                    - img
                  - generic: LCV
                - generic:
                  - generic:
                    - generic:
                      - img
                    - generic: Fotoğraf
  - button "Davetiyeyi açmak için dokununuz":
    - generic [ref=e3] [cursor=pointer]:
      - generic [ref=e6]:
        - paragraph [ref=e7]: Together with their families
        - heading "Elif Yılmaz & Kerem Arslan" [level=1] [ref=e8]:
          - text: Elif Yılmaz
          - generic [ref=e9]: "&"
          - text: Kerem Arslan
        - paragraph [ref=e10]: 12.09.2026
      - generic [ref=e11]: 👑
    - paragraph [ref=e17] [cursor=pointer]: ✉️ AÇMAK İÇİN DOKUNUN ✉️
  - alert [ref=e18]
```