{ pkgs ? import <nixpkgs> { } }:
let
  myAppEnv = pkgs.poetry2nix.mkPoetryEnv {
    projectDir = ./.;
    editablePackageSources = {
      my-app = ./.;
    };
    python = pkgs.python310;
  };
in
myAppEnv.env.overrideAttrs (oldAttrs: {
  buildInputs = [ pkgs.python310Packages.flit-core ];
})
