// Simplified implementation for skills visualization
document.addEventListener('DOMContentLoaded', function() {
  // Collect all skill tags from the page
  const skillTags = Array.from(document.querySelectorAll('.skill-tag'))
    .map(tag => tag.textContent.trim());
  
  // Initialize visualization
  try {
    if (typeof tf !== 'undefined') {
      console.log('TensorFlow.js loaded successfully');
      generateTensorFlowVisualization(skillTags);
    } else {
      throw new Error('TensorFlow.js not available');
    }
  } catch (error) {
    console.error('Falling back to standard visualization:', error);
    fallbackVisualization(skillTags);
  }
  
  // TensorFlow-based visualization (simplified)
  async function generateTensorFlowVisualization(skills) {
    const canvas = document.getElementById('skillsVisualization');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Create a seed based on skills and current date
    const currentDate = new Date().toISOString().slice(0,10);
    const seed = hashString(skills.join('') + currentDate);
    
    // Generate a gradient background using TensorFlow.js
    const background = tf.tidy(() => {
      // Create a gradient tensor
      const x = tf.linspace(0, 1, width);
      const y = tf.linspace(0, 1, height);
      const [meshX, meshY] = tf.meshgrid(x, y);
      
      // Create RGB channels with different patterns
      const r = meshX.mul(tf.scalar(0.8)).add(tf.scalar(0.2));
      const g = meshY.mul(tf.scalar(0.7)).add(tf.scalar(0.3));
      const b = meshX.mul(meshY).mul(tf.scalar(0.9)).add(tf.scalar(0.1));
      
      // Stack channels to create RGB image (keep values in 0-1 range)
      return tf.stack([r, g, b], 2);
    });
    
    // Create a uint8 tensor for display (values 0-255)
    const displayTensor = tf.tidy(() => {
      return background.mul(255).cast('int32');
    });
    
    // Render background to canvas
    await tf.browser.toPixels(displayTensor, canvas);
    
    // Clean up tensors
    tf.dispose([background, displayTensor]);
    
    // Draw skill bubbles
    const colors = [
      '#0678BE', '#68A063', '#4A4A4A', '#2EAD33', 
      '#2088FF', '#FF5700', '#E34C26', '#3776AB'
    ];
    
    skills.forEach((skill, index) => {
      const skillHash = hashString(skill);
      
      // Position based on skill hash
      const x = 100 + ((skillHash + index * 50) % (width - 200));
      const y = 100 + ((skillHash * 3 + index * 30) % (height - 200));
      const size = 30 + (skillHash % 20);
      
      // Draw bubble
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = colors[index % colors.length];
      ctx.globalAlpha = 0.7;
      ctx.fill();
      
      // Draw skill name
      ctx.font = '14px Inter, sans-serif';
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = 1;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(skill.substring(0, Math.min(skill.length, 10)), x, y);
    });
    
    // Add some connecting lines between related skills
    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 2;
    
    for (let i = 0; i < skills.length - 1; i++) {
      const startHash = hashString(skills[i]);
      const startX = 100 + ((startHash + i * 50) % (width - 200));
      const startY = 100 + ((startHash * 3 + i * 30) % (height - 200));
      
      for (let j = i + 1; j < skills.length; j++) {
        // Connect only some pairs based on hash
        if ((hashString(skills[i] + skills[j]) % 5) < 2) {
          const endHash = hashString(skills[j]);
          const endX = 100 + ((endHash + j * 50) % (width - 200));
          const endY = 100 + ((endHash * 3 + j * 30) % (height - 200));
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      }
    }
  }
  
  // Fallback visualization
  function fallbackVisualization(skills) {
    const canvas = document.getElementById('skillsVisualization');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Create a gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f0f0f0');
    gradient.addColorStop(1, '#e0e0e0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw title
    ctx.font = '20px Inter, sans-serif';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('My Technology Skills', width/2, 40);
    
    // Draw colored circles for each skill
    const colors = [
      '#0678BE', '#68A063', '#4A4A4A', '#2EAD33', 
      '#2088FF', '#FF5700', '#E34C26', '#3776AB'
    ];
    
    skills.forEach((skill, index) => {
      const x = 100 + (index % 3) * 200;
      const y = 100 + Math.floor(index / 3) * 100;
      
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(skill.substring(0, Math.min(skill.length, 10)), x, y);
    });
  }
  
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
