require 'sinatra'

class TicTacToe < Sinatra::Base

    get "/" do
        erb :index
    end

end
