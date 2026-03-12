defmodule Jamsitant.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      JamsitantWeb.Telemetry,
      Jamsitant.Repo,
      {DNSCluster, query: Application.get_env(:jamsitant, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Jamsitant.PubSub},
      # Start a worker by calling: Jamsitant.Worker.start_link(arg)
      # {Jamsitant.Worker, arg},
      # Start to serve requests, typically the last entry
      JamsitantWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Jamsitant.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    JamsitantWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
