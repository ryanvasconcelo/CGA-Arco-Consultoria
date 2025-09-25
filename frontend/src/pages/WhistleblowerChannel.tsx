import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Shield } from "lucide-react";
import QRCode from "@/assets/qrcode.png";

const WhistleblowerChannel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div className="space-y-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-8 w-8 text-primary" />
                  <h1 className="text-3xl font-bold text-primary">CANAL DE</h1>
                </div>
                <h1 className="text-3xl font-bold text-foreground">DENÚNCIA</h1>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-foreground">ARCO</h2>
                    <p className="text-lg text-muted-foreground">CONSULTORIA</p>
                    <p className="text-lg text-muted-foreground">EM SEGURANÇA</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary italic">
                    Sua opinião é muito importante para nós!
                  </h3>

                  <div className="space-y-3 text-muted-foreground">
                    <p>Nossa solução precisa da sua participação</p>
                    <p>Se você presenciar ou sofrer algo que prejudique qualquer certificação,</p>
                    <p className="font-semibold text-primary">Denuncie!</p>
                  </div>

                  <div className="mt-8">
                    <p className="text-lg font-semibold text-center text-primary">
                      Envie por meio do QRCode abaixo!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* QR Code Display */}
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <div className="bg-white p-8 rounded-lg shadow-lg inline-block">
                    <div className="w-64 h-64 bg-black/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <img src={QRCode} alt="QR Code" className="w-full h-full object-contain border-4" />
                    </div>
                    <p className="text-sm text-black/60">
                      Escaneie para acessar o canal
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Logos */}
          <div className="mt-16 flex justify-between items-end">
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold">
                <span className="text-foreground">CGA</span>
              </div>
              <div className="text-sm text-muted-foreground">
                CENTRAL DE GESTÃO ARCO
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>INTUIX</span>
              </div>
              <div className="text-xs text-muted-foreground">
                SMART CERTIFICATIONS
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                  <span className="text-primary font-bold">B</span>
                </div>
                <span>BLOCKCHAIN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhistleblowerChannel;