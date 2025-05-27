// Enhanced implementation for skills visualization with scenic backgrounds
document.addEventListener('DOMContentLoaded', function() {
    // Collect all skill tags from the page
    const skillTags = Array.from(document.querySelectorAll('.skill-tag'))
    .map(tag => tag.textContent.trim());
  
    // Generate visualization immediately
    generateTechnologyTrendVisualization(skillTags);
    
    // Generate a technology trend visualization with scenic background
    async function generateTechnologyTrendVisualization(skills) {
        const canvas = document.getElementById('skillsVisualization');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Generate a random seed for this page load
        const randomSeed = Math.floor(Math.random() * 10000000) + new Date().getMilliseconds();
        
        // Randomly select a "trending" skill
        const trendingSkillIndex = randomSeed % skills.length;
        const trendingSkill = skills[trendingSkillIndex];
        
        // Randomly select a trend type
        const trendTypes = ['Growth Trend', 'Job Demand'];
        const trendTypeIndex = randomSeed % trendTypes.length;
        const trendType = trendTypes[trendTypeIndex];
        
        // Generate a scenic background based on trend type and skill
        const skillHash = hashString(trendingSkill + randomSeed);
        drawScenicBackground(ctx, width, height, trendType, skillHash, randomSeed);
        
        // Draw trending skill title
        ctx.font = 'bold 28px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.textAlign = 'center';
        ctx.fillText(`${trendingSkill}`, width/2, 50);
        
        // Draw trend type as a prominent subtitle with background
        const subtitleText = trendType;
        const subtitleWidth = ctx.measureText(subtitleText).width + 60;
        const subtitleHeight = 40;
        const subtitleX = width/2 - subtitleWidth/2;
        const subtitleY = 70;
        
        // Draw background for subtitle
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(subtitleX, subtitleY, subtitleWidth, subtitleHeight);
        
        // Draw subtitle text
        ctx.font = 'bold 22px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(subtitleText, width/2, subtitleY + subtitleHeight/2);
        
        // Generate trend data visualization
        drawTrendVisualization(ctx, width, height, trendingSkill, trendType, skillHash, randomSeed);
        
        // Draw related skills
        drawRelatedSkills(ctx, width, height, skills, trendingSkillIndex, randomSeed);
    }
    
    // Draw a procedurally generated scenic background
    function drawScenicBackground(ctx, width, height, trendType, skillHash, randomSeed) {
        // Determine which type of scene to generate based on trend type and seed
        const sceneType = randomSeed % 4; // 0-3: different scene types
        
        // Set color palette based on trend type
        let skyColors, mountainColors, foregroundColors;
        
        if (trendType === 'Growth Trend') {
        // Vibrant, optimistic colors for growth
        skyColors = [
            ['#003366', '#1a4d85', '#3973ac', '#7db9e8'], // Blue dawn
            ['#00111e', '#033e5e', '#1e6e8e', '#55a5b5'], // Deep blue
            ['#2c3e50', '#34495e', '#5d6d7e', '#aab7b8'], // Slate blue
            ['#4a2c40', '#904e95', '#cb6ce6', '#ffc0cb']  // Purple sunset
        ][sceneType];
        
        mountainColors = [
            ['#1a3a1a', '#2d5a2d', '#3b7a3b', '#4c9a4c'], // Green mountains
            ['#2d2d2d', '#3d3d3d', '#4d4d4d', '#5d5d5d'], // Gray mountains
            ['#4d3319', '#664426', '#7f5533', '#996633'], // Brown mountains
            ['#330033', '#660066', '#990099', '#cc00cc']  // Purple mountains
        ][sceneType];
        
        foregroundColors = [
            ['#0d260d', '#194d19', '#267326', '#339933'], // Green foreground
            ['#1a1a1a', '#262626', '#333333', '#404040'], // Dark foreground
            ['#331a00', '#663300', '#994d00', '#cc6600'], // Brown foreground
            ['#1a001a', '#330033', '#4d004d', '#660066']  // Purple foreground
        ][sceneType];
        } else {
        // Warm, energetic colors for job demand
        skyColors = [
            ['#4a1c1c', '#7a2929', '#a93636', '#d84343'], // Red sunset
            ['#4a3413', '#7a5620', '#a9782d', '#d89a3a'], // Golden sunset
            ['#4a0000', '#7a0000', '#a90000', '#d80000'], // Deep red
            ['#4a3500', '#7a5900', '#a97c00', '#d89f00']  // Golden hour
        ][sceneType];
        
        mountainColors = [
            ['#331a1a', '#4d2626', '#663333', '#804040'], // Reddish mountains
            ['#332b1a', '#4d4026', '#665533', '#806640'], // Golden mountains
            ['#330d0d', '#4d1313', '#661919', '#801f1f'], // Dark red mountains
            ['#332600', '#4d3900', '#664c00', '#805f00']  // Golden mountains
        ][sceneType];
        
        foregroundColors = [
            ['#260d0d', '#4d1919', '#732626', '#993333'], // Red foreground
            ['#261a0d', '#4d3319', '#734d26', '#996633'], // Golden foreground
            ['#260000', '#4d0000', '#730000', '#990000'], // Deep red foreground
            ['#261a00', '#4d3300', '#734d00', '#996600']  // Golden foreground
        ][sceneType];
        }
        
        // Draw sky gradient
        const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
        skyGradient.addColorStop(0, skyColors[0]);
        skyGradient.addColorStop(0.4, skyColors[1]);
        skyGradient.addColorStop(0.7, skyColors[2]);
        skyGradient.addColorStop(1, skyColors[3]);
        
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, width, height);
        
        // Add stars or sun/moon based on scene type
        if (sceneType === 0 || sceneType === 2) {
        // Stars for night scenes
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 100; i++) {
            const x = (randomSeed * (i + 1)) % width;
            const y = (randomSeed * (i + 2)) % (height * 0.6);
            const size = ((randomSeed * (i + 3)) % 3) + 1;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        } else {
        // Sun or moon for day/dusk scenes
        const centerX = width * (0.2 + (randomSeed % 60) / 100); // Position between 20-80% of width
        const centerY = height * (0.1 + (randomSeed % 20) / 100); // Position between 10-30% of height
        const radius = width * (0.05 + (randomSeed % 5) / 100); // Size between 5-10% of width
        
        // Create radial gradient for sun/moon
        const celestialGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius * 1.5
        );
        
        if (trendType === 'Growth Trend') {
            // Bright sun for growth
            celestialGradient.addColorStop(0, 'rgba(255, 255, 200, 1)');
            celestialGradient.addColorStop(0.5, 'rgba(255, 200, 100, 0.8)');
            celestialGradient.addColorStop(1, 'rgba(255, 150, 50, 0)');
        } else {
            // Warmer sun/moon for demand
            celestialGradient.addColorStop(0, 'rgba(255, 200, 150, 1)');
            celestialGradient.addColorStop(0.5, 'rgba(255, 150, 100, 0.8)');
            celestialGradient.addColorStop(1, 'rgba(255, 100, 50, 0)');
        }
        
        ctx.fillStyle = celestialGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
        }
        
        // Draw distant mountains
        drawMountainRange(ctx, width, height * 0.6, height * 0.3, mountainColors, skillHash, randomSeed);
        
        // Draw closer mountains/hills
        drawMountainRange(ctx, width, height * 0.7, height * 0.2, foregroundColors, skillHash + 1000, randomSeed + 1000);
        
        // Draw foreground silhouette
        drawForeground(ctx, width, height, foregroundColors[0], skillHash + 2000, randomSeed + 2000);
        
        // Add a subtle overlay to improve text readability
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, width, height);
    }
    
    // Draw a mountain range
    function drawMountainRange(ctx, width, startY, height, colors, seed, randomSeed) {
        const segments = 10; // Number of mountains
        const segmentWidth = width / segments;
        
        // Create mountain points
        const points = [];
        for (let i = 0; i <= segments; i++) {
        const x = i * segmentWidth;
        let y;
        
        if (i === 0 || i === segments) {
            y = startY + height; // Ensure mountains start and end at the bottom
        } else {
            // Generate mountain height with Perlin-like noise
            const noise = Math.sin(i * 0.5 + seed) * Math.cos(i * 0.3 + randomSeed) * 0.5 + 0.5;
            y = startY + height - (noise * height);
        }
        
        points.push({ x, y });
        }
        
        // Add some intermediate points for more natural mountains
        const refinedPoints = [];
        for (let i = 0; i < points.length - 1; i++) {
        refinedPoints.push(points[i]);
        
        // Add 1-2 intermediate points between each pair
        const intermediateCount = 1 + (seed % 2);
        for (let j = 1; j <= intermediateCount; j++) {
            const ratio = j / (intermediateCount + 1);
            const x = points[i].x + (points[i+1].x - points[i].x) * ratio;
            
            // Add some randomness to intermediate points
            const heightNoise = (Math.sin(x * 0.1 + seed) * 0.3 + 0.7) * height * 0.3;
            const y = points[i].y + (points[i+1].y - points[i].y) * ratio - heightNoise;
            
            refinedPoints.push({ x, y });
        }
        }
        refinedPoints.push(points[points.length - 1]);
        
        // Draw mountains with gradient
        const gradient = ctx.createLinearGradient(0, startY - height, 0, startY + height);
        gradient.addColorStop(0, colors[3]); // Lightest at top
        gradient.addColorStop(0.3, colors[2]);
        gradient.addColorStop(0.6, colors[1]);
        gradient.addColorStop(1, colors[0]); // Darkest at bottom
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, startY + height);
        
        // Draw the mountain path
        refinedPoints.forEach(point => {
        ctx.lineTo(point.x, point.y);
        });
        
        ctx.lineTo(width, startY + height);
        ctx.closePath();
        ctx.fill();
    }
    
    // Draw foreground elements (trees, buildings, etc.)
    function drawForeground(ctx, width, height, color, seed, randomSeed) {
        const foregroundY = height * 0.85;
        
        // Draw a silhouette of trees or buildings
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(0, foregroundY);
        
        const elementCount = 30; // Number of elements (trees/buildings)
        const elementWidth = width / elementCount;
        
        for (let i = 0; i <= elementCount; i++) {
        const x = i * elementWidth;
        
        if (i % 2 === 0) {
            // Tree or tall building
            const elementHeight = height * (0.05 + (Math.sin(i + seed) * 0.05));
            ctx.lineTo(x - elementWidth * 0.1, foregroundY);
            ctx.lineTo(x, foregroundY - elementHeight);
            ctx.lineTo(x + elementWidth * 0.1, foregroundY);
        } else {
            // Smaller element
            const elementHeight = height * (0.02 + (Math.cos(i + randomSeed) * 0.02));
            ctx.lineTo(x - elementWidth * 0.05, foregroundY);
            ctx.lineTo(x, foregroundY - elementHeight);
            ctx.lineTo(x + elementWidth * 0.05, foregroundY);
        }
        }
        
        ctx.lineTo(width, foregroundY);
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
    }

// Draw a visualization representing trend data with clear type indicator
  function drawTrendVisualization(ctx, width, height, skill, trendType, skillHash, randomSeed) {
    // Draw a trend line chart
    const centerY = height / 2;
    const startX = 50;
    const endX = width - 50;
    
    // Customize appearance based on trend type
    let amplitude, frequency, trendDirection, lineColor;
    
    if (trendType === 'Growth Trend') {
      // Growth trend - more wavy, generally upward
      amplitude = 30 + (randomSeed % 30);
      frequency = 2 + (randomSeed % 3);
      trendDirection = 1; // Upward
      lineColor = '#4CAF50'; // Green
    } else {
      // Job demand - sharper changes, varied direction
      amplitude = 40 + (randomSeed % 40);
      frequency = 1 + (randomSeed % 2);
      trendDirection = (randomSeed % 100 > 30) ? 1 : -1; // Mostly upward but can be downward
      lineColor = '#FF5722'; // Orange/red
    }
    
    // Draw trend line
    ctx.beginPath();
    ctx.moveTo(startX, centerY);
    
    // Generate a trend line
    for (let x = startX; x <= endX; x += 5) {
      const progress = (x - startX) / (endX - startX);
      
      // Add some noise to the line
      const noise = Math.sin(progress * 10 + randomSeed) * 5;
      
      // Create trend direction
      const trend = trendDirection * progress * 60;
      
      const y = centerY - 
               amplitude * Math.sin(progress * frequency + (randomSeed % 10)) - 
               trend + noise;
      
      ctx.lineTo(x, y);
    }
    
    // Style and stroke the path
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Add gradient fill under the line
    const gradient = ctx.createLinearGradient(0, centerY - amplitude, 0, centerY + 50);
    gradient.addColorStop(0, `${lineColor}80`); // 50% opacity
    gradient.addColorStop(1, `${lineColor}00`); // 0% opacity
    
    ctx.lineTo(endX, centerY + 50);
    ctx.lineTo(startX, centerY + 50);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Add trend value with random but realistic percentage
    let trendValue;
    if (trendType === 'Growth Trend') {
      trendValue = 15 + (randomSeed % 45); // 15-59% for growth
    } else {
      trendValue = 40 + (randomSeed % 55); // 40-94% for job demand
    }
    
    // Draw percentage with improved visibility
    // Add a semi-transparent background for better readability
    const percentText = `${trendValue}%`;
    const percentWidth = ctx.measureText(percentText).width + 40;
    const percentHeight = 70;
    const percentX = width/2 - percentWidth/2;
    const percentY = centerY + 45;
    
    // Draw background for percentage
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(percentX, percentY, percentWidth, percentHeight);
    
    // Draw percentage
    ctx.font = 'bold 64px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(percentText, width/2, percentY + percentHeight/2);
    
    // Add a description label based on trend type
    let descriptionText;
    if (trendType === 'Growth Trend') {
      if (trendValue > 40) {
        descriptionText = 'Rapid Growth';
      } else if (trendValue > 25) {
        descriptionText = 'Steady Growth';
      } else {
        descriptionText = 'Emerging Technology';
      }
    } else { // Job Demand
      if (trendValue > 75) {
        descriptionText = 'Very High Demand';
      } else if (trendValue > 50) {
        descriptionText = 'High Demand';
      } else {
        descriptionText = 'Growing Demand';
      }
    }
    
    // Draw description with background for better visibility
    const descWidth = ctx.measureText(descriptionText).width + 40;
    const descHeight = 36;
    const descX = width/2 - descWidth/2;
    const descY = centerY + 130;
    
    // Draw background for description
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(descX, descY, descWidth, descHeight);
    
    // Draw description text
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(descriptionText, width/2, descY + descHeight/2);
  }

// Draw related skills on the right side without round bubbles
// Draw related skills on the right side without shortening names
function drawRelatedSkills(ctx, width, height, skills, trendingIndex, randomSeed) {
  // Determine how many related skills to show (2-3)
  const relatedSkillsCount = 2 + (randomSeed % 2);
  const relatedSkills = [];
  
  // Create a shuffled copy of skills (excluding the trending one)
  const shuffledSkills = skills
    .filter((_, i) => i !== trendingIndex)
    .sort(() => 0.5 - Math.random()); // Simple shuffle
  
  // Take the first few as related skills
  for (let i = 0; i < Math.min(relatedSkillsCount, shuffledSkills.length); i++) {
    relatedSkills.push(shuffledSkills[i]);
  }
  
  // Draw related skills section title
  const titleText = 'Related Skills';
  const titleWidth = ctx.measureText(titleText).width + 40;
  const titleHeight = 36;
  const titleX = width - titleWidth - 20;
  const titleY = height * 0.25;
  
  // Draw background for title
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(titleX, titleY, titleWidth, titleHeight);
  
  // Draw title text
  ctx.font = 'bold 18px Inter, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(titleText, titleX + titleWidth/2, titleY + titleHeight/2);
  
  // Draw related skills as text boxes only (no bubbles)
  const colors = [
    '#0678BE', '#68A063', '#4A4A4A', '#2EAD33', 
    '#2088FF', '#FF5700', '#E34C26', '#3776AB'
  ];
  
  const skillListStartY = titleY + titleHeight + 30;
  const skillSpacing = 50; // Reduced spacing since we don't have bubbles
  
  relatedSkills.forEach((skill, index) => {
    const y = skillListStartY + (index * skillSpacing);
    
    // Use full skill name without shortening
    const skillText = skill;
    
    // Measure text to create appropriately sized background
    ctx.font = 'bold 14px Inter, sans-serif';
    const textWidth = ctx.measureText(skillText).width + 30;
    const textHeight = 30;
    
    // Center the text box on the right side of the canvas
    // but ensure it doesn't go off the edge
    const maxX = width - 20; // 20px from right edge
    const textX = Math.min(maxX - textWidth, width - textWidth - 20);
    
    // Use the color that would have been used for the bubble
    const bgColor = colors[index % colors.length];
    
    // Draw colored background for skill name
    ctx.fillStyle = bgColor;
    ctx.fillRect(textX, y, textWidth, textHeight);
    
    // Add a subtle border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(textX, y, textWidth, textHeight);
    
    // Draw skill name
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(skillText, textX + textWidth/2, y + textHeight/2);
  });
}

w

    // Helper function to hash strings
    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash);
  }
});
