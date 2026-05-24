export function SunnySceneBackground() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      {/* Sky — static base */}
      <img
        src="/landscape/sky.webp"
        alt=""
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
      />

      {/* Zoom layer — far landscape + clouds zoom in from bottom-center vanishing point */}
      <div
        className="absolute inset-0 sunny-zoom-in"
        style={{ transformOrigin: 'bottom center' }}
      >
        <img
          src="/landscape/landscape_far.webp"
          alt=""
          draggable={false}
          className="absolute bottom-0 left-0 w-full select-none pointer-events-none"
        />

        <img src="/clouds/cloud_1.webp" alt="" draggable={false}
          className="absolute select-none pointer-events-none"
          style={{ top: '5%', left: '-3%', width: '32%' }} />
        <img src="/clouds/cloud_5.webp" alt="" draggable={false}
          className="absolute select-none pointer-events-none"
          style={{ top: '10%', right: '-2%', width: '30%' }} />
        <img src="/clouds/cloud_2.webp" alt="" draggable={false}
          className="absolute select-none pointer-events-none"
          style={{ top: '1%', left: '30%', width: '22%' }} />
        <img src="/clouds/cloud_6.webp" alt="" draggable={false}
          className="absolute select-none pointer-events-none"
          style={{ top: '2%', left: '10%', width: '13%' }} />
        <img src="/clouds/cloud_3.webp" alt="" draggable={false}
          className="absolute select-none pointer-events-none"
          style={{ top: '15%', left: '52%', width: '16%' }} />
      </div>

      {/* Sun — slides in from top-right independently */}
      <img
        src="/sun/sun.webp"
        alt=""
        draggable={false}
        className="absolute sunny-sun-in select-none pointer-events-none"
        style={{ top: '5%', right: '7%', width: '9%' }}
      />

      {/* Close landscape — static anchor, sits on top */}
      <img
        src="/landscape/landscape_close.webp"
        alt=""
        draggable={false}
        className="absolute bottom-0 left-0 w-full select-none pointer-events-none"
      />
    </div>
  )
}
