import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';

interface ParticleCloudProps {
  shipType: 'interceptor' | 'support' | 'tank';
  isPlayer: boolean;
}

function ParticleCloud({ shipType, isPlayer }: ParticleCloudProps) {
  const particles = useRef(Array.from({ length: 20 }, (_, index) => ({
    x: useRef(new Animated.Value(16 + (Math.random() - 0.5) * 16)).current,
    y: useRef(new Animated.Value(16 + (Math.random() - 0.5) * 16)).current,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    opacity: useRef(new Animated.Value(0.8 + Math.random() * 0.2)).current,
    scale: useRef(new Animated.Value(0.8 + Math.random() * 0.4)).current,
    id: index,
  }))).current;

  const getBoundary = (x: number, y: number) => {
    const centerX = 16, centerY = 16;
    const dx = x - centerX, dy = y - centerY;
    
    switch (shipType) {
      case 'interceptor': // Circular boundary (sphere)
        return Math.sqrt(dx * dx + dy * dy) <= 11;
      case 'support': // Triangular boundary (pyramid)
        const distFromTop = y - 5; // Distance from triangle top
        const triangleWidth = distFromTop * 0.8; // Triangle gets wider as we go down
        return (y >= 5) && (y <= 27) && (Math.abs(dx) <= triangleWidth);
      case 'tank': // Square boundary (cube)
        return Math.abs(dx) <= 10 && Math.abs(dy) <= 10;
      default:
        return Math.sqrt(dx * dx + dy * dy) <= 11;
    }
  };

  const constrainToBoundary = (x: number, y: number) => {
    const centerX = 16, centerY = 16;
    const dx = x - centerX, dy = y - centerY;
    
    switch (shipType) {
      case 'interceptor': // Force back into circle
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 11) {
          const scale = 11 / distance;
          return { x: centerX + dx * scale, y: centerY + dy * scale };
        }
        break;
      case 'support': // Force back into triangle
        const distFromTop = y - 5;
        const maxTriangleWidth = distFromTop * 0.8;
        let newX = x, newY = y;
        
        if (y < 5) newY = 5;
        if (y > 27) newY = 27;
        if (Math.abs(dx) > maxTriangleWidth) {
          newX = centerX + Math.sign(dx) * maxTriangleWidth;
        }
        return { x: newX, y: newY };
      case 'tank': // Force back into square
        return {
          x: Math.max(6, Math.min(26, x)),
          y: Math.max(6, Math.min(26, y))
        };
    }
    return { x, y };
  };

  useEffect(() => {
    const updateParticles = () => {
      particles.forEach((particle, index) => {
        // Get current positions
        const currentX = particle.x._value;
        const currentY = particle.y._value;
        
        // Fluid forces - attract to center with gentle force
        const centerX = 16, centerY = 16;
        const toCenterX = (centerX - currentX) * 0.008;
        const toCenterY = (centerY - currentY) * 0.008;
        
        // Add fluid-like forces between particles (cohesion + separation)
        let cohesionX = 0, cohesionY = 0;
        let separationX = 0, separationY = 0;
        let neighborCount = 0;
        
        particles.forEach((other) => {
          if (other.id !== particle.id) {
            const dx = other.x._value - currentX;
            const dy = other.y._value - currentY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 8) { // Neighbor threshold
              // Cohesion - move toward neighbors
              cohesionX += dx;
              cohesionY += dy;
              neighborCount++;
              
              // Separation - avoid too close neighbors
              if (distance < 4) {
                separationX -= dx / distance * 0.1;
                separationY -= dy / distance * 0.1;
              }
            }
          }
        });
        
        if (neighborCount > 0) {
          cohesionX = (cohesionX / neighborCount) * 0.005;
          cohesionY = (cohesionY / neighborCount) * 0.005;
        }
        
        // Apply forces to velocity
        particle.vx += toCenterX + cohesionX + separationX;
        particle.vy += toCenterY + cohesionY + separationY;
        
        // Add gentle random motion for fluid-like behavior
        particle.vx += (Math.random() - 0.5) * 0.01;
        particle.vy += (Math.random() - 0.5) * 0.01;
        
        // Calculate new position
        let newX = currentX + particle.vx;
        let newY = currentY + particle.vy;
        
        // Strict boundary enforcement
        if (!getBoundary(newX, newY)) {
          // Force particle back into boundary
          const constrainedPos = constrainToBoundary(newX, newY);
          newX = constrainedPos.x;
          newY = constrainedPos.y;
          
          // Apply soft reflection to velocity
          const boundaryForceX = (centerX - newX) * 0.05;
          const boundaryForceY = (centerY - newY) * 0.05;
          
          particle.vx = particle.vx * -0.2 + boundaryForceX;
          particle.vy = particle.vy * -0.2 + boundaryForceY;
        }
        
        // Double-check boundary constraint
        const finalPos = constrainToBoundary(newX, newY);
        newX = finalPos.x;
        newY = finalPos.y;
        
        // Fluid damping (less aggressive)
        particle.vx *= 0.995;
        particle.vy *= 0.995;
        
        // Smooth position update
        Animated.timing(particle.x, {
          toValue: newX,
          duration: 30,
          useNativeDriver: false,
        }).start();
        
        Animated.timing(particle.y, {
          toValue: newY,
          duration: 30,
          useNativeDriver: false,
        }).start();
        
        // Gentle opacity variation
        Animated.timing(particle.opacity, {
          toValue: 0.7 + Math.sin(Date.now() * 0.003 + index) * 0.2,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    };

    const interval = setInterval(updateParticles, 30); // Faster updates for smoother motion
    return () => clearInterval(interval);
  }, [shipType]);

  const color = isPlayer ? '#60a5fa' : '#f87171'; // Brighter colors
  const glowColor = isPlayer ? '#3b82f6' : '#ef4444';

  const getShapeContainer = () => {
    const borderColor = isPlayer ? '#3b82f650' : '#ef444450';
    
    switch (shipType) {
      case 'interceptor':
        return (
          <View style={[styles.shapeContainer, styles.circleShape, { borderColor }]} />
        );
      case 'support':
        return Platform.OS === 'web' ? (
          <View style={[styles.shapeContainer, styles.squareShape, { borderColor }]} />
        ) : (
          <View style={[styles.shapeContainer, styles.triangleShape, { borderColor }]} />
        );
      case 'tank':
        return (
          <View style={[styles.shapeContainer, styles.squareShape, { borderColor }]} />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.particleContainer}>
      {getShapeContainer()}
      {particles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              backgroundColor: color,
              left: particle.x,
              top: particle.y,
              opacity: particle.opacity,
              transform: [{ scale: particle.scale }],
              ...(Platform.OS !== 'web' && {
                shadowColor: glowColor,
                shadowOpacity: 1,
                shadowRadius: 4,
                elevation: 8,
              }),
            }
          ]}
        />
      ))}
    </View>
  );
}

export default function BoardPreview() {
  const [activeRound, setActiveRound] = useState(0);
  const playerShips = [
    { pos: 5, type: 'interceptor' as const },
    { pos: 10, type: 'support' as const },
    { pos: 15, type: 'tank' as const }
  ];
  const enemyShips = [
    { pos: 20, type: 'tank' as const },
    { pos: 25, type: 'interceptor' as const },
    { pos: 30, type: 'support' as const }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRound((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const renderCell = (index: number) => {
    const playerShip = playerShips.find(ship => ship.pos === index);
    const enemyShip = enemyShips.find(ship => ship.pos === index);

    return (
      <View key={index} style={styles.cell}>
        {playerShip && (
          <ParticleCloud shipType={playerShip.type} isPlayer={true} />
        )}
        {enemyShip && (
          <ParticleCloud shipType={enemyShip.type} isPlayer={false} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {Array.from({ length: 36 }, (_, i) => renderCell(i))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 40 },
  board: { width: 240, height: 240, flexDirection: 'row', flexWrap: 'wrap' },
  cell: { 
    width: 40, 
    height: 40, 
    backgroundColor: '#1f2937', 
    borderWidth: 1, 
    borderColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  particleContainer: {
    width: 32,
    height: 32,
    position: 'relative',
  },
  particle: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
  },
  shapeContainer: {
    position: 'absolute',
    borderWidth: 1,
    opacity: 0.3,
  },
  circleShape: {
    width: 22,
    height: 22,
    borderRadius: 11,
    left: 5,
    top: 5,
  },
  triangleShape: {
    width: 20,
    height: 22,
    left: 6,
    top: 5,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 22,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopWidth: 0,
  },
  squareShape: {
    width: 20,
    height: 20,
    left: 6,
    top: 6,
  },
});