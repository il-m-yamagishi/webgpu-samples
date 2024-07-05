// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface GPUShaderModule {}

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface GPUPipelineLayout {}

/**
 * @link https://gpuweb.github.io/gpuweb/#enumdef-gpuautolayoutmode
 */
enum GPUAutoLayoutMode {
	auto = "auto",
}

/**
 * @link https://gpuweb.github.io/gpuweb/#dictdef-gpushadermodulecompilationhint
 */
interface GPUShaderModuleCompilationHint {
	entryPoint: string;
	layout?: GPUPipelineLayout | GPUAutoLayoutMode;
}

/**
 * @link https://gpuweb.github.io/gpuweb/#dictdef-gpuobjectdescriptorbase
 */
interface GPUObjectDescriptorBase {
	label?: string;
}

/**
 * @link https://gpuweb.github.io/gpuweb/#dictdef-gpushadermoduledescriptor
 */
interface GPUShaderModuleDescriptor extends GPUObjectDescriptorBase {
	code: string;
	sourceMap?: unknown;
	compilationHints?: GPUShaderModuleCompilationHint[];
}

/**
 * @link https://gpuweb.github.io/gpuweb/#gpudevice
 */
interface GPUDevice {
	createShaderModule(descriptor: GPUShaderModuleDescriptor): GPUShaderModule;
}

/**
 * @link https://developer.mozilla.org/en-US/docs/Web/API/GPUAdapter/features
 * @link https://gpuweb.github.io/gpuweb/#gpusupportedfeatures
 */
interface GPUSupportedFeatures extends Set {}

/**
 * @link https://developer.mozilla.org/en-US/docs/Web/API/GPUSupportedLimits
 * @link https://gpuweb.github.io/gpuweb/#gpusupportedlimits
 */
interface GPUSupportedLimits {
	readonly maxTextureDimension1D: number;
	readonly maxTextureDimension2D: number;
	readonly maxTextureDimension3D: number;
	readonly maxTextureArrayLayers: number;
	readonly maxBindGroups: number;
	readonly maxBindGroupsPlusVertexBuffers: number;
	readonly maxBindingsPerBindGroup: number;
	readonly maxDynamicUniformBuffersPerPipelineLayout: number;
	readonly maxDynamicStorageBuffersPerPipelineLayout: number;
	readonly maxSampledTexturesPerShaderStage: number;
	readonly maxSamplersPerShaderStage: number;
	readonly maxStorageBuffersPerShaderStage: number;
	readonly maxStorageTexturesPerShaderStage: number;
	readonly maxUniformBuffersPerShaderStage: number;
	readonly maxUniformBufferBindingSize: number;
	readonly maxStorageBufferBindingSize: number;
	readonly minUniformBufferOffsetAlignment: number;
	readonly minStorageBufferOffsetAlignment: number;
	readonly maxVertexBuffers: number;
	readonly maxBufferSize: number;
	readonly maxVertexAttributes: number;
	readonly maxVertexBufferArrayStride: number;
	readonly maxInterStageShaderComponents: number;
	readonly maxInterStageShaderVariables: number;
	readonly maxColorAttachments: number;
	readonly maxColorAttachmentBytesPerSample: number;
	readonly maxComputeWorkgroupStorageSize: number;
	readonly maxComputeInvocationsPerWorkgroup: number;
	readonly maxComputeWorkgroupSizeX: number;
	readonly maxComputeWorkgroupSizeY: number;
	readonly maxComputeWorkgroupSizeZ: number;
	readonly maxComputeWorkgroupsPerDimension: number;
}

/**
 * @link https://gpuweb.github.io/gpuweb/#gpuadapterinfo
 */
interface GPUAdapterInfo {
	readonly vendor: string;
	readonly architecture: string;
	readonly device: string;
	readonly description: string;
}

/**
 * @link https://gpuweb.github.io/gpuweb/#dictdef-gpuobjectdescriptorbase
 */
interface GPUQueueDescriptorBase {
	label: string;
}

/**
 * @link https://gpuweb.github.io/gpuweb/#gpuqueuedescriptor
 */
interface GPUQueueDescriptor extends GPUQueueDescriptorBase {}

interface GPUDeviceDescriptorBase {
	label: string;
}

/**
 * @link https://gpuweb.github.io/gpuweb/#gpudevicedescriptor
 */
interface GPUDeviceDescriptor extends GPUDeviceDescriptorBase {
	requiredFeatures: string[];
	requiredLimits: Record<string, number>;
	defaultQueue: GPUQueueDescriptor;
}

/**
 * @link https://gpuweb.github.io/gpuweb/#gpuadapter
 */
interface GPUAdapter {
	/**
	 * The features read-only property of the GPUAdapter interface returns a GPUSupportedFeatures object that describes additional functionality supported by the adapter.
	 * You should note that not all features will be available to WebGPU in all browsers that support it, even if the features are supported by the underlying hardware. This could be due to constraints in the underlying system, browser, or adapter. For example:
	 * The underlying system might not be able to guarantee exposure of a feature in a way that is compatible with a certain browser.
	 * The browser vendor might not have found a secure way to implement support for that feature, or might just not have gotten round to it yet.
	 * If you are hoping to take advantage of a specific additional feature in a WebGPU app, thorough testing is advised.
	 */
	readonly features: GPUSupportedFeatures;
	/**
	 * The isFallbackAdapter read-only property of the GPUAdapter interface returns true if the adapter is a fallback adapter, and false if not.
	 */
	readonly isFallbackAdapter: boolean;
	/**
	 * The limits read-only property of the GPUAdapter interface returns a GPUSupportedLimits object that describes the limits supported by the adapter.
	 * You should note that, rather than reporting the exact limits of each GPU, browsers will likely report different tier values of different limits to reduce the unique information available to drive-by fingerprinting. For example, the tiers of a certain limit might be 2048, 8192, and 32768. If your GPU's actual limit is 16384, the browser will still report 8192.
	 * Given that different browsers will handle this differently and the tier values may change over time, it is hard to provide an accurate account of what limit values to expect — thorough testing is advised.
	 */
	readonly limits: GPUSupportedLimits;
	readonly info: GPUAdapterInfo;
	requestDevice(): Promise<GPUDevice>;
	/**
	 * The requestDevice() method of the GPUAdapter interface returns a Promise that fulfills with a GPUDevice object, which is the primary interface for communicating with the GPU.
	 */
	requestDevice(descriptor: GPUDeviceDescriptor): Promise<GPUDevice>;
}

/**
 * A WGSLLanguageFeatures object that reports the WGSL language extensions supported by the WebGPU implementation.
 */
interface WGSLLanguageFeatures extends Set {}

/**
 * @link https://gpuweb.github.io/gpuweb/#dictdef-gpurequestadapteroptions
 */
interface GPURequestAdapterOptions {
	/**
	 * An enumerated value that can be used to provide a hint to the user agent
	 * indicating what class of adapter should be chosen from the system's available adapters.
	 * Available values are:
	 * undefined (or not specified), which provides no hint.
	 * "low-power", which provides a hint to prioritize power savings over performance.
	 * If your app runs OK with this setting, it is recommended to use it,
	 * as it can significantly improve battery life on portable devices.
	 * This is usually the default if no options are provided.
	 * "high-performance", which provides a hint to prioritize performance over power consumption.
	 * You are encouraged to only specify this value if absolutely necessary,
	 * since it may significantly decrease battery life on portable devices.
	 * It may also result in increased GPUDevice loss — the system will sometimes elect to switch to
	 * a lower-power adapter to save power.
	 * This hint's primary purpose is to influence which GPU is used in a multi-GPU system.
	 * For instance, some laptops have a low-power integrated GPU and a high-performance discrete GPU.
	 * Different factors may affect which adapter is returned including battery status, attached displays,
	 * or removable GPUs.
	 *
	 * Note: On Chrome running on dual-GPU macOS devices,
	 * if requestAdapter() is called without a powerPreference option,
	 * the high-performance discrete GPU is returned when the user's device is on AC power.
	 * Otherwise, the low-power integrated GPU is returned.
	 */
	powerPreference?: "low-power" | "high-performance";
	forceFallbackAdapter?: boolean;
}

/**
 * The GPU interface of the WebGPU API is the starting point for using WebGPU.
 * It can be used to return a GPUAdapter from which you can request devices,
 * configure features and limits, and more.
 * @link https://gpuweb.github.io/gpuweb/#gpu-interface
 */
interface GPU {
	/**
	 * A WGSLLanguageFeatures object instance. This is a setlike object.
	 */
	readonly wgslLanguageFeatures: WGSLLanguageFeatures;
	/**
	 * The requestAdapter() method of the GPU interface returns a Promise
	 * that fulfills with a GPUAdapter object instance. From this you can request a GPUDevice,
	 * adapter info, features, and limits.
	 * Note that the user agent chooses whether to return an adapter.
	 * If so, it chooses according to the provided options.
	 * If no options are provided, the device will provide access to the default adapter,
	 * which is usually good enough for most purposes.
	 */
	requestAdapter(
		options: GPURequestAdapterOptions = {},
	): Promise<GPUAdapter | null>;
	/**
	 * The getPreferredCanvasFormat() method of the GPU interface returns the optimal canvas texture format
	 * for displaying 8-bit depth, standard dynamic range content on the current system.
	 * This is commonly used to provide a GPUCanvasContext.configure() call with the optimal format value
	 * for the current system. This is recommended — if you don't use the preferred format
	 * when configuring the canvas context, you may incur additional overhead,
	 * such as additional texture copies, depending on the platform.
	 */
	getPreferredCanvasFormat(): "rgba8unorm" | "bgra8unorm";
}

/**
 * Add navigator.gpu to Navigator interface
 * @link https://gpuweb.github.io/gpuweb/#navigator-gpu
 */
interface NavigatorGPU {
	/**
	 * The gpu read-only property of the WorkerNavigator interface returns the GPU object
	 * for the current worker context, which is the entry point for the WebGPU API.
	 */
	readonly gpu?: GPU;
}

interface Navigator extends NavigatorGPU {}

/**
 * @link https://gpuweb.github.io/gpuweb/#dictdef-gpucanvastonemapping
 */
interface GPUCanvasToneMapping {
	mode?: "standard" | "extended";
}

/**
 * @link https://gpuweb.github.io/gpuweb/#gpucanvasalphamode
 */
enum GPUCanvasAlphaMode {
	opaque = "opaque",
	premultiplied = "premultiplied",
}

/**
 * @link https://gpuweb.github.io/gpuweb/#dictdef-gpucanvasconfiguration
 */
interface GPUCanvasConfiguration {
	device: GPUDevice;
	format: string;
	usage?: number;
	viewFormats?: string[];
	colorSpace?: "srgb" | "display-p3";
	toneMapping?: GPUCanvasToneMapping;
	alphaMode?: GPUCanvasAlphaMode;
}

interface GPUCanvasContext {
	/**
	 * @link https://gpuweb.github.io/gpuweb/#dom-gpucanvascontext-configure
	 */
	configure(configuration): void;
}

interface HTMLCanvasElementWebGPU {
	getContext(contextType: "webgpu"): GPUCanvasContext;
}

interface HTMLCanvasElement extends HTMLCanvasElementWebGPU {}
