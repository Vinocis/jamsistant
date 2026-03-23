{
  pkgs,
  lib,
  config,
  inputs,
  ...
}:

{
  packages = with pkgs; [
    git
  ];

  languages = {
    javascript = {
      enable = true;
      npm.enable = true;
    };
  };

}
