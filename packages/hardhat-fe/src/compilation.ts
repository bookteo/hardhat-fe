import fsExtra from "fs-extra";
import { Artifact, Artifacts, ProjectPathsConfig } from "hardhat/types";
import { localPathToSourceName } from "hardhat/utils/source-names";
import path from "path";
import { FeConfig } from "./types";
import { FE_BINARY_PATH } from "./fe-binary-path.ts";


const ARTIFACT_FORMAT_VERSION = "hh-vyper-artifact-1";

export async function compile(
  feConfig: FeConfig,
  paths: ProjectPathsConfig,
  artifacts: Artifacts
) {

  for (const file of files) {
    const pathFromCWD = path.relative(process.cwd(), file);
    const pathFromSources = path.relative(paths.sources, file);

    if (await isAlreadyCompiled(file, paths, vyperVersion, files)) {
      console.log(pathFromCWD, "is already compiled");
      continue;
    }

    console.log("Compiling", pathFromCWD);

  
    compileWithDocker(file, docker, dockerImage, paths)

    const vyperOutput = JSON.parse(processResult.stdout.toString("utf8"))[
      pathFromSources
    ];

    const sourceName = await localPathToSourceName(paths.root, file);
    const artifact = getArtifactFromVyperOutput(sourceName, vyperOutput);

    await artifacts.saveArtifactAndDebugFile(artifact);
    
  }

}

async function isAlreadyCompiled(
  sourceFile: string,
  paths: ProjectPathsConfig,
  sources: string[]
) {
  const contractName = pathToContractName(sourceFile);
  const artifactPath = path.join(paths.artifacts, `${contractName}.json`);
  if (!(await fsExtra.pathExists(artifactPath))) {
    return false;
  }

  const artifactCtime = (await fsExtra.stat(artifactPath)).ctimeMs;

  const stats = await Promise.all(sources.map((f) => fsExtra.stat(f)));

  const lastSourcesCtime = Math.max(...stats.map((s) => s.ctimeMs));

  return lastSourcesCtime < artifactCtime;
}

function pathToContractName(file: string) {
  const sourceName = path.basename(file);
  return sourceName.substring(0, sourceName.indexOf("."));
}

function getArtifactFromVyperOutput(sourceName: string, output: any): Artifact {
  const contractName = pathToContractName(sourceName);

  return {
    _format: ARTIFACT_FORMAT_VERSION,   //genau anschauen wie das artifact formatiert wird von vyper
    contractName,
    sourceName,
    abi: output.abi,
    bytecode: add0xPrefixIfNecessary(output.bytecode),
    deployedBytecode: add0xPrefixIfNecessary(output.bytecode_runtime),
    linkReferences: {},
    deployedLinkReferences: {},
  };
}

function add0xPrefixIfNecessary(hex: string): string {
  hex = hex.toLowerCase();

  if (hex.slice(0, 2) === "0x") {
    return hex;
  }

  return `0x${hex}`;
}



async function compileWithDocker(
  filePath: string,
  docker: HardhatDocker,
  dockerImage: Image,
  paths: ProjectPathsConfig
): Promise<ProcessResult> {
  const pathFromSources = path.relative(paths.sources, filePath);

  return docker.runContainer(
    dockerImage,
    ["vyper", "-f", "combined_json", pathFromSources],
    {
      binds: {
        [paths.sources]: "/code",
      },
      workingDirectory: "/code",
    }
  );
}
