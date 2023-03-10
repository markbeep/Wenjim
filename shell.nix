{ pkgs ? (import <nixpkgs> { }).pkgs }:
with pkgs;
mkShell {
  nativeBuildInputs = [
    poetry
    python311
  ];
  shellHook = ''
    export LD_LIBRARY_PATH=${stdenv.cc.cc.lib}/lib/
  '';
}
