{ pkgs ? (import <nixpkgs> { }).pkgs }:
with pkgs;
mkShell {
  shellHook = ''
    export LD_LIBRARY_PATH=${stdenv.cc.cc.lib}/lib/
  '';
}
