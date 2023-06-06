{
  description = "Flake for developing on Wenjim";

  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.poetry2nix = {
    url = "github:nix-community/poetry2nix";
    inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, flake-utils, poetry2nix }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        # see https://github.com/nix-community/poetry2nix/tree/master#api for more functions and examples.
        inherit (poetry2nix.legacyPackages.${system}) mkPoetryApplication;
        inherit (poetry2nix.legacyPackages.${system}) mkPoetryEnv;
        inherit (poetry2nix.legacyPackages.${system}) overrides;
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        packages = {
          myapp = mkPoetryApplication { projectDir = self; };
          default = self.packages.${system}.myapp;
        };

        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            postgresql_15
            stdenv.cc.cc.lib
            python310
            poetry
            nodejs-18_x

            (mkPoetryEnv
              {
                projectDir = ./backend;
                preferWheels = true;
              })
          ];
        };
      }
    );
}
