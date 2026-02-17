# Pseudo code version:

# vec2 uv = pixelCoord / screenSize;
# // Adjust the uv to center around the origin
# uv = uv * 2.0
# uv = uv - 1.0
# vec3 rayDirection = vec3(uv.x, uv.y, -1.0)
# vec3 rayOrigin = vec3(0.0, 0.0, 0.0)
# vec3 spherePosition = vec3(0.0, 0.0, -5.0)
# float sphereRadius = 1.0
# float a = rayDirection.x * rayDirection.x + rayDirection.y * rayDirection.y + rayDirection.z * rayDirection.z
# float b = -2.0 * spherePosition.z * spherePosition.z * rayDirection.z * rayDirection.z
# float c = spherePosition.z * spherePosition.z - sphereRadius * sphereRadius
# float discriminant = (b * b) - (4 * a * c)
# discriminant = clamp(discriminant, 0.0, 1.0)
# discriminant = discriminant * 1000000000.0
# discriminant = clamp(discriminant, 0.0, 1.0)
# outColor = vec4(discriminant, 0.0, 0.0, 1.0)
