defmodule JamsitantWeb.Router do
  use JamsitantWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", JamsitantWeb do
    pipe_through :api
  end
end
