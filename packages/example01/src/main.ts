/**
 * @link https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
 */
async function main() {
	if (!navigator.gpu) {
		throw new Error("WebGPU is not supported");
	}

	const adapter = await navigator.gpu.requestAdapter({
		forceFallbackAdapter: false,
		powerPreference: "high-performance",
	});

	if (!adapter) {
		throw new Error("No adapter found");
	}

	const device = await adapter.requestDevice();

	// @link https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API#basic_render_pipeline
	const code = `
struct VertexOut {
  @builtin(position) position : vec4f,
  @location(0) color : vec4f
}

@vertex
fn vertex_main(@location(0) position: vec4f,
               @location(1) color: vec4f) -> VertexOut
{
  var output : VertexOut;
  output.position = position;
  output.color = color;
  return output;
}

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f
{
  return fragData.color;
}
`;

	const shaderModule = device.createShaderModule({
		code,
	});

	const canvas = document.querySelector<HTMLCanvasElement>("render-canvas");
	if (!canvas) {
		throw new Error("No canvas found");
	}

	const context = canvas.getContext("webgpu") as GPUCanvasContext | null;
	if (!context) {
		throw new Error("No context found");
	}

	const format = navigator.gpu.getPreferredCanvasFormat();
	const alphaMode = "premultiplied";
	context.configure({
		device,
		format,
		alphaMode,
	});

	const vertices = new Float32Array([
		0.0, 0.6, 0, 1, 1, 0, 0, 1, -0.5, -0.6, 0, 1, 0, 1, 0, 1, 0.5, -0.6, 0, 1,
		0, 0, 1, 1,
	]);

	const vertexBuffer = device.createBuffer({
		size: vertices.byteLength, // make it big enough to store vertices in
		usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
	});

	device.queue.writeBuffer(vertexBuffer, 0, vertices, 0, vertices.length);

	const vertexBuffers = [
		{
			attributes: [
				{
					shaderLocation: 0, // position
					offset: 0,
					format: "float32x4",
				},
				{
					shaderLocation: 1, // color
					offset: 16,
					format: "float32x4",
				},
			],
			arrayStride: 32,
			stepMode: "vertex",
		},
	];

	const pipelineDescriptor = {
		vertex: {
			module: shaderModule,
			entryPoint: "vertex_main",
			buffers: vertexBuffers,
		},
		fragment: {
			module: shaderModule,
			entryPoint: "fragment_main",
			targets: [
				{
					format: navigator.gpu.getPreferredCanvasFormat(),
				},
			],
		},
		primitive: {
			topology: "triangle-list",
		},
		layout: "auto",
	};

	const renderPipeline = device.createRenderPipeline(pipelineDescriptor);

	const commandEncoder = device.createCommandEncoder();

	const clearColor = { r: 0.0, g: 0.5, b: 1.0, a: 1.0 };

	const renderPassDescriptor = {
		colorAttachments: [
			{
				clearValue: clearColor,
				loadOp: "clear",
				storeOp: "store",
				view: context.getCurrentTexture().createView(),
			},
		],
	};

	const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

	passEncoder.setPipeline(renderPipeline);
	passEncoder.setVertexBuffer(0, vertexBuffer);
	passEncoder.draw(3);

	passEncoder.end();

	device.queue.submit([commandEncoder.finish()]);
}

main().catch((err) => window.alert(err));
