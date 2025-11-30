# Chrome Web Store Submission Checklist

## Prerequisites

1. **Google Account** - You need a Gmail account
2. **Developer Fee** - One-time $5 USD registration fee
3. **Publisher Account** - Register at [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)

## Required Assets

### ✅ Extension Package
- [x] manifest.json with version 1.0.0
- [x] All required files (popup, background, options)
- [x] Icons (16x16, 32x32, 48x48, 128x128)

### 📝 Store Listing Information

#### Required Text Content

1. **Name** (max 75 chars):
   ```
   Digital Eye Relief - 20-20-20 Rule Timer
   ```

2. **Summary** (max 132 chars):
   ```
   Reduce eye strain with the 20-20-20 rule. Get reminded every 20 minutes to look 20 feet away for 20 seconds.
   ```

3. **Description** (max 16,000 chars):
   ```
   🌟 Digital Eye Relief - Your Eyes Deserve a Break

   Working long hours on your computer? Experiencing eye fatigue, dryness, or headaches? Digital Eye Relief helps you follow the medically-recommended 20-20-20 rule to reduce digital eye strain.

   ✅ WHAT IS THE 20-20-20 RULE?
   
   Recommended by the American Optometric Association:
   • Every 20 MINUTES of screen time
   • Look at something 20 FEET (6 meters) away  
   • For 20 SECONDS

   This simple practice helps your eye muscles relax, prevents fatigue, and reduces the risk of computer vision syndrome.

   ✨ KEY FEATURES

   ⏱️ Smart Timer System
   • Automatically tracks your work sessions
   • Runs silently in the background
   • Precise timing using Chrome's alarm system
   
   🔔 Flexible Notifications
   • System notifications (non-intrusive)
   • Full-screen modal overlays (when you need discipline!)
   • Quiet badge indicators
   • Optional sound alerts
   
   ⚙️ Fully Customizable
   • Focus duration: 5-60 minutes (default 20)
   • Break duration: 10-60 seconds (default 20)
   • Notification style preferences
   • Sound on/off toggle
   
   🎨 Beautiful Design
   • Clean, calming interface
   • Sage green color theme (easy on the eyes!)
   • Minimal and non-distracting
   
   🔒 Privacy First
   • Zero data collection
   • No analytics or tracking
   • Everything runs locally
   • No internet connection needed
   • Open source

   📊 WHY YOU NEED THIS

   Up to 97% of digital device users experience symptoms of digital eye strain:
   • Eye fatigue and discomfort
   • Dry, irritated eyes
   • Blurred vision
   • Headaches
   • Neck and shoulder pain
   
   Regular breaks using the 20-20-20 rule can significantly reduce these symptoms!

   🚀 HOW TO USE

   1. Click the extension icon to open the popup
   2. Press the green Play button
   3. Work normally - the timer runs in the background
   4. Get reminded after 20 minutes
   5. Look into the distance for 20 seconds
   6. Repeat automatically!
   
   The badge shows minutes remaining, so you're always aware of your next break.

   ⚡ PERFECT FOR

   • Remote workers and developers
   • Students studying online
   • Gamers and content creators
   • Anyone who spends hours on screens
   • People who forget to take breaks
   
   💡 TIPS FOR BEST RESULTS

   • Actually look at distant objects (not just close your eyes)
   • Stand up and stretch during longer breaks
   • Adjust screen brightness and position
   • Keep artificial tears handy for dry eyes
   • Get regular eye exams
   
   🌍 THE SCIENCE

   The 20-20-20 rule was developed by Dr. Jeffrey Anshel, an optometrist specializing in computer vision. Research shows that taking regular breaks:
   • Reduces accommodation stress on eye muscles
   • Improves tear film stability
   • Decreases symptoms of asthenopia (eye strain)
   • Promotes overall visual comfort
   
   ⭐ COMING SOON

   • Usage statistics (local only)
   • Achievement system for motivation
   • Multi-language support
   • More customization options

   ---

   Remember: This extension is a helpful tool, but it's not a substitute for professional eye care. If you experience persistent vision problems, please consult an optometrist or ophthalmologist.

   Your eyes work hard for you every day. Give them the breaks they deserve! 👀✨
   ```

4. **Category**:
   - Health & Fitness (or Productivity)

5. **Language**:
   - English

#### Required Images

1. **Small Promo Tile** (440x280 pixels) - REQUIRED
   - Screenshot or branded graphic
   - Shows up in search results

2. **Screenshots** (1280x800 or 640x400) - REQUIRED (at least 1)
   - Popup interface
   - Settings page
   - Break notification
   - Recommend 3-5 screenshots

3. **Large Promo Tile** (920x680 pixels) - OPTIONAL but recommended
   - Featured in prominent placements

4. **Marquee Promo Tile** (1400x560 pixels) - OPTIONAL
   - Featured in Chrome Web Store homepage

5. **Small Tile** (128x128 pixels) - OPTIONAL
   - Used in various placements

### 🎨 Screenshot Ideas

1. **Screenshot 1: Main Popup**
   - Show the timer interface with "Focusing" state
   - Badge visible with minutes remaining
   - Clean, attractive

2. **Screenshot 2: Break Notification**
   - Modal overlay showing "Look away for 20 seconds"
   - Countdown visible

3. **Screenshot 3: Settings Page**
   - Show customization options
   - Sliders for durations
   - Notification type selection

4. **Screenshot 4: Background Operation**
   - Show browser with badge
   - Demonstrate it works while browsing

5. **Screenshot 5: Info/Welcome**
   - Explain the 20-20-20 rule
   - Visual breakdown of 20 minutes, 20 feet, 20 seconds

## Submission Steps

1. **Prepare Package**
   ```bash
   # Build the extension
   npx vite build --config vite.extension.config.ts && node script/build-extension.js
   
   # Create ZIP file
   cd dist-extension
   zip -r ../digital-eye-relief-v1.0.0.zip .
   cd ..
   ```

2. **Create Screenshots**
   - Take screenshots of the extension in use
   - Resize to required dimensions (1280x800 recommended)
   - Edit to highlight key features

3. **Create Promotional Images**
   - Design small promo tile (440x280)
   - Optional: large promo tile (920x680)
   - Use brand colors (sage green theme)

4. **Go to Developer Dashboard**
   - Visit: https://chrome.google.com/webstore/devconsole/
   - Click "New Item"
   - Upload ZIP file

5. **Fill Store Listing**
   - Add description (copy from above)
   - Upload all images
   - Set category and language
   - Add support contact email

6. **Privacy Practices**
   - Certify you don't collect data
   - No login required
   - No personal data collected

7. **Submit for Review**
   - Review usually takes 1-3 business days
   - Check for rejection emails
   - Respond to any requests for clarification

## Post-Submission

### If Approved ✅
- Extension goes live immediately
- Share the store link
- Monitor reviews and ratings
- Respond to user feedback

### If Rejected ❌
Common reasons:
- Missing privacy policy (not needed if no data collection)
- Unclear description
- Low-quality screenshots
- Permissions not justified in description

Fix issues and resubmit!

## Version Updates

When updating the extension:

1. Update version in `manifest.json`
2. Rebuild: `npm run build:extension`
3. Create new ZIP
4. Upload to existing item in dashboard
5. Submit for review (faster than initial submission)

## Promotion Tips

- Share on Product Hunt
- Post on Reddit (r/chrome, r/eyehealth, r/productivity)
- Twitter/X announcement
- Developer communities
- LinkedIn post

## Support & Maintenance

- Monitor Chrome Web Store reviews
- Respond to user questions
- Fix bugs promptly
- Add requested features
- Keep manifest and permissions minimal

---

**Ready to Launch! 🚀**

The extension is fully built and ready for Chrome Web Store submission. Good luck!
